// check-critical-files.js
const fs = require('fs');
const path = require('path');

// Lista de arquivos críticos para verificar (caminho relativo à raiz do projeto)
const criticalFiles = [
  './pages/_app.tsx',
  './pages/_document.tsx',
  './components/layout/Layout.tsx',
  './components/layout/MainLayout.tsx',
  './src/components/layout/Layout.tsx',
  './src/components/layout/MainLayout.tsx',
];

// Expressão regular para encontrar componentes Link com tag <a> como filho
const linkWithAnchorRegex = /<Link\s+([^>]*?)>\s*<a([^>]*?)>/g;

// Expressão regular para verificar importação do Link
const linkImportRegex = /import\s+(?:Link|{\s*Link\s*})\s+from\s+['"]next\/link['"]/;

console.log('Verificando arquivos críticos que podem estar causando o problema...\n');

// Verificar cada arquivo crítico
let problemsFound = false;

criticalFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`Arquivo não encontrado: ${filePath}`);
    return;
  }
  
  console.log(`Verificando: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Verificar importação do Link
  const linkImport = content.match(linkImportRegex);
  if (!linkImport) {
    console.log(`  - \x1b[33mO arquivo não importa o componente Link do next/link\x1b[0m`);
  } else {
    console.log(`  - Link importado: ${linkImport[0]}`);
  }
  
  // Verificar problemas com Link
  const matches = content.match(linkWithAnchorRegex);
  if (matches && matches.length > 0) {
    problemsFound = true;
    console.log(`  - \x1b[31m[PROBLEMA] Encontrados ${matches.length} componentes Link problemáticos\x1b[0m`);
    
    // Mostrar cada problema encontrado
    content.replace(linkWithAnchorRegex, (match, linkProps, aProps, offset) => {
      const surroundingContent = content.substring(
        Math.max(0, offset - 30),
        Math.min(content.length, offset + match.length + 30)
      );
      
      console.log(`  - Contexto: ...${surroundingContent}...`);
      
      // Sugerir correção
      const aAttrs = aProps.match(/(\w+)=["']([^"']*)["']/g) || [];
      let combinedProps = linkProps;
      
      for (const attr of aAttrs) {
        const [name, value] = attr.split('=');
        if (!combinedProps.includes(`${name}=`)) {
          combinedProps += ` ${attr}`;
        }
      }
      
      console.log(`  - Correção: <Link ${combinedProps}>...</Link>`);
      console.log('  ------------------------------');
      
      return match;
    });
  } else {
    console.log(`  - \x1b[32m[OK] Nenhum componente Link problemático encontrado\x1b[0m`);
  }
  
  // Verificar uso de componentes que podem conter Link
  const customComponentMatches = content.match(/<[A-Z][A-Za-z0-9]*\s+[^>]*>/g);
  if (customComponentMatches && customComponentMatches.length > 0) {
    console.log(`  - Componentes personalizados usados:`);
    
    const uniqueComponents = new Set();
    customComponentMatches.forEach(match => {
      const componentName = match.match(/<([A-Z][A-Za-z0-9]*)/)[1];
      uniqueComponents.add(componentName);
    });
    
    [...uniqueComponents].forEach(component => {
      console.log(`    > ${component}`);
    });
    
    console.log(`  - \x1b[33mVerifique se algum desses componentes usa Link incorretamente\x1b[0m`);
  }
  
  console.log('');
});

// Verificar _app.tsx específico
const appFile = './pages/_app.tsx';
if (fs.existsSync(appFile)) {
  console.log('\nAnalisando componentes globais em _app.tsx...');
  const appContent = fs.readFileSync(appFile, 'utf8');
  
  // Verificar importações de componentes
  const importMatches = appContent.match(/import\s+[A-Za-z0-9_,\s{} ]*\s+from\s+['"][^'"]+['"]/g);
  if (importMatches) {
    console.log('Importações encontradas:');
    importMatches.forEach(match => {
      console.log(`  ${match}`);
    });
    
    // Verificar componentes importados de terceiros
    const thirdPartyImports = importMatches.filter(match => 
      !match.includes("from '.") && !match.includes('from ".')
    );
    
    if (thirdPartyImports.length > 0) {
      console.log('\nImportações de terceiros (possíveis causas):');
      thirdPartyImports.forEach(match => {
        console.log(`  ${match}`);
      });
    }
  }
}

if (!problemsFound) {
  console.log('\n\x1b[32mNenhum problema encontrado nos arquivos críticos.\x1b[0m');
  console.log('Possíveis soluções:');
  console.log('1. Execute check-all-links.js para verificar TODOS os arquivos');
  console.log('2. Adicione legacyBehavior ao next.config.js usando add-legacy-behavior.js');
  console.log('3. Verifique bibliotecas de terceiros importadas que possam estar usando Link');
} else {
  console.log('\n\x1b[31mProblemas encontrados!\x1b[0m');
  console.log('Corrija os problemas ou use o script add-legacy-behavior.js para adicionar legacyBehavior ao next.config.js');
}