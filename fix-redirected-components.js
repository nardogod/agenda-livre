// fix-redirected-components.js
// Este script verifica os componentes redirecionados mencionados no projeto

const fs = require('fs');
const path = require('path');

// Lista de arquivos redirecionados a verificar
const redirectedComponents = [
  'components/booking/ClientDashboardLayout.tsx',
  'components/booking/Footer.tsx',
  'components/booking/Sidebar.tsx',
  'components/booking/ProfessionalDashboardLayout.tsx'
];

// Expressão regular para encontrar componentes Link com tag <a> como filho
const linkWithAnchorRegex = /<Link\s+([^>]*?)>\s*<a([^>]*?)>/g;

// Função para verificar um arquivo e suas importações
function checkFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`Arquivo não encontrado: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar o arquivo atual
    const matches = content.match(linkWithAnchorRegex);
    if (matches && matches.length > 0) {
      console.log(`\x1b[31m[PROBLEMA] ${filePath}: ${matches.length} componentes Link problemáticos\x1b[0m`);
      
      // Mostrar os problemas encontrados
      content.replace(linkWithAnchorRegex, (match, linkProps, aProps) => {
        console.log(`  - Problema encontrado: ${match}`);
        return match;
      });
    } else {
      console.log(`\x1b[32m[OK] ${filePath}\x1b[0m`);
    }
    
    // Verificar se este é um arquivo de redirecionamento e rastrear o componente original
    const importMatch = content.match(/import\s+(?:Component|[A-Za-z0-9_]+)\s+from\s+['"](.+)['"]/);
    if (importMatch && importMatch[1]) {
      const importPath = importMatch[1];
      console.log(`  - Este arquivo redireciona para: ${importPath}`);
      
      // Resolver o caminho do componente importado
      let resolvedPath = importPath;
      if (!path.isAbsolute(importPath)) {
        resolvedPath = path.resolve(path.dirname(filePath), importPath);
      }
      
      console.log(`  - Verificando componente original: ${resolvedPath}`);
      checkFile(resolvedPath);
    }
  } catch (error) {
    console.error(`Erro ao processar ${filePath}:`, error);
  }
}

// Função principal
function main() {
  console.log('Verificando componentes redirecionados...\n');
  
  for (const componentPath of redirectedComponents) {
    console.log(`\nVerificando: ${componentPath}`);
    checkFile(componentPath);
  }
  
  console.log('\nVerificação concluída!');
  console.log('Instruções para corrigir:');
  console.log('1. Altere <Link href="..."><a ...>Texto</a></Link>');
  console.log('2. Para: <Link href="..." ...>Texto</Link>');
  console.log('3. OU adicione legacyBehavior: <Link href="..." legacyBehavior><a ...>Texto</a></Link>');
}

// Executar
main();