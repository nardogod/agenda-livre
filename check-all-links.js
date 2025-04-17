// check-all-links.js
const fs = require('fs');
const path = require('path');

// Função para buscar todos os arquivos JS/TS no projeto
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    // Ignorar node_modules e .next
    if (file === 'node_modules' || file === '.next'|| file === '.history') {
      return;
    }
    
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// Expressão regular para encontrar componentes Link com tag <a> como filho
const linkWithAnchorRegex = /<Link\s+([^>]*?)>\s*<a([^>]*?)>/g;

// Verificar todos os arquivos no projeto
console.log('Verificando TODOS os arquivos do projeto...');
console.log('Isso pode levar algum tempo, aguarde...\n');

try {
  // Obter todos os arquivos JS/TS no projeto
  const allFiles = getAllFiles('.');
  console.log(`Total de ${allFiles.length} arquivos encontrados para verificar`);

  // Verificar cada arquivo
  let problemFiles = [];

  allFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.match(linkWithAnchorRegex);
      
      if (matches && matches.length > 0) {
        console.log(`\x1b[31m[PROBLEMA] ${file}: ${matches.length} componentes Link problemáticos\x1b[0m`);
        
        problemFiles.push({ file, count: matches.length });
        
        // Mostrar contexto do problema
        let contentLines = content.split('\n');
        content.replace(linkWithAnchorRegex, (match, linkProps, aProps, offset) => {
          // Encontrar o número da linha aproximada
          let lineNumber = 1;
          let pos = 0;
          for (const line of contentLines) {
            pos += line.length + 1; // +1 para o \n
            if (pos > offset) break;
            lineNumber++;
          }
          
          // Mostrar algumas linhas antes e depois para contexto
          const startLine = Math.max(0, lineNumber - 3);
          const endLine = Math.min(contentLines.length, lineNumber + 3);
          const contextLines = contentLines.slice(startLine, endLine);
          
          console.log(`  - Linha aproximada: ${lineNumber}`);
          console.log(`  - Contexto:\n${contextLines.join('\n')}`);
          console.log('  ------------------------------');
          
          return match;
        });
      }
    } catch (error) {
      console.error(`Erro ao ler ${file}:`, error.message);
    }
  });

  // Mostrar resumo
  if (problemFiles.length === 0) {
    console.log('\n\x1b[32mNenhum problema encontrado em nenhum arquivo!\x1b[0m');
    console.log('O erro pode estar em uma biblioteca de terceiros ou em código gerado em tempo de execução.');
    console.log('Tente adicionar a configuração legacyBehavior ao next.config.js:');
    console.log(`
// next.config.js
module.exports = {
  // outras configurações...
  experimental: {
    legacyBehavior: true
  }
}`);
  } else {
    console.log('\n\x1b[31mProblemas encontrados nos seguintes arquivos:\x1b[0m');
    problemFiles.forEach(({ file, count }) => {
      console.log(`- ${file}: ${count} problemas`);
    });
    
    console.log('\nPara corrigir, você pode:');
    console.log('1. Modificar manualmente cada arquivo com problema');
    console.log('2. Usar o script fix-single-file.js para cada arquivo');
    console.log('3. Adicionar legacyBehavior ao next.config.js para uma solução global temporária');
  }
} catch (error) {
  console.error('Erro ao executar o script:', error);
}