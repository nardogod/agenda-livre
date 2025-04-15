// fix-redirects.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Diretório raiz do projeto
const projectRoot = process.cwd();
const pagesDir = path.join(projectRoot, 'src', 'pages');

// Função para corrigir um arquivo de redirecionamento
function fixRedirectFile(filePath) {
  const fileName = path.basename(filePath);
  const dirName = path.dirname(filePath);
  const relativePath = path.relative(pagesDir, dirName);
  
  // Determinar o caminho correto para o arquivo canônico em src
  let canonicalPath;
  
  if (relativePath === '') {
    // Arquivo na raiz de pages
    canonicalPath = `../../src/pages/${fileName}`;
  } else {
    // Arquivo em um subdiretório
    canonicalPath = `../../../../src/pages/${relativePath}/${fileName}`;
  }
  
  // Conteúdo correto para o arquivo de redirecionamento
  const correctContent = `// Redirecionamento automático para o componente canônico
// Este arquivo redireciona para a implementação em src/pages
export * from "${canonicalPath}";
export { default } from "${canonicalPath}";
`;
  
  console.log(`Corrigindo redirecionamento em: ${filePath}`);
  console.log(`Redirecionando para: ${canonicalPath}`);
  
  // Escrever o conteúdo correto no arquivo
  fs.writeFileSync(filePath, correctContent, 'utf8');
}

// Função para criar arquivos de página padrão em src/pages
function createDefaultPageFile(pagePath, componentName) {
  const targetDir = path.dirname(pagePath);
  const fileName = path.basename(pagePath);
  const srcPagePath = path.join(projectRoot, 'src', 'pages', path.relative(pagesDir, targetDir), fileName);
  
  // Criar diretório se não existir
  if (!fs.existsSync(path.dirname(srcPagePath))) {
    fs.mkdirSync(path.dirname(srcPagePath), { recursive: true });
  }
  
  // Determinar o tipo de página e criar um conteúdo adequado
  let pageContent;
  
  if (fileName.includes('[id]') || fileName.includes('[professionalId]')) {
    // Página dinâmica com parâmetro de rota
    const paramName = fileName.includes('[id]') ? 'id' : 'professionalId';
    
    pageContent = `// ${srcPagePath}
import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';

const ${componentName} = () => {
  const router = useRouter();
  const { ${paramName} } = router.query;

  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-xl font-medium mb-4">${componentName}</h1>
        <p>Parâmetro: ${paramName} = {${paramName}}</p>
      </div>
    </MainLayout>
  );
};

export default ${componentName};
`;
  } else {
    // Página regular
    pageContent = `// ${srcPagePath}
import React from 'react';
import MainLayout from '../../components/layout/MainLayout';

const ${componentName} = () => {
  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-xl font-medium mb-4">${componentName}</h1>
        <p>Esta página está em construção.</p>
      </div>
    </MainLayout>
  );
};

export default ${componentName};
`;
  }
  
  console.log(`Criando arquivo de página padrão em: ${srcPagePath}`);
  fs.writeFileSync(srcPagePath, pageContent, 'utf8');
}

// Encontrar todos os arquivos de redirecionamento com sintaxe inválida
console.log('Procurando arquivos de redirecionamento inválidos...');
const redirectFiles = glob.sync(path.join(pagesDir, '**/*.{tsx,jsx}'));

redirectFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Verificar se é um arquivo de redirecionamento inválido
  if (content.includes("export * from \"../../'../src") || 
      content.includes("export * from \"../../../'../src") || 
      content.includes("export * from \"../../../../'../src") || 
      content.includes("export * from \"../'../src")) {
    
    // Gerar nome do componente baseado no caminho do arquivo
    const fileName = path.basename(filePath, path.extname(filePath));
    let componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
    
    // Tratar casos especiais
    if (fileName === '[id]') componentName = 'DetailPage';
    if (fileName === 'index') {
      const dirName = path.basename(path.dirname(filePath));
      componentName = dirName.charAt(0).toUpperCase() + dirName.slice(1) + 'Page';
    }
    
    // Criar um arquivo de página padrão em src/pages primeiro
    createDefaultPageFile(filePath, componentName);
    
    // Depois corrigir o redirecionamento
    fixRedirectFile(filePath);
  }
});

console.log('Concluído! Todos os redirecionamentos foram corrigidos.');