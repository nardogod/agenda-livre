// find-link-problems.js
// Este script identifica componentes Link problemáticos mas NÃO modifica nenhum arquivo

const fs = require('fs');
const path = require('path');

// Lista específica de arquivos e diretórios a serem verificados
const specificPaths = [
  'components/layout',
  'components/professionals',
  'components/booking',
  'pages'
];

// Expressão regular para encontrar componentes Link com tag <a> como filho
const linkWithAnchorRegex = /<Link\s+([^>]*?)>\s*<a([^>]*?)>/g;

// Função para verificar um arquivo
function checkFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`Arquivo não encontrado: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(linkWithAnchorRegex);
    
    if (matches && matches.length > 0) {
      console.log(`\x1b[31m[PROBLEMA] ${filePath}: ${matches.length} componentes Link problemáticos\x1b[0m`);
      
      // Extrair e mostrar contexto para cada problema
      let contentLines = content.split('\n');
      content.replace(linkWithAnchorRegex, (match, linkProps, aProps, offset) => {
        // Encontrar o número da linha baseado no offset
        let lineNumber = 1;
        let currentPos = 0;
        for (let i = 0; i < contentLines.length; i++) {
          if (currentPos + contentLines[i].length >= offset) {
            lineNumber = i + 1;
            break;
          }
          currentPos += contentLines[i].length + 1; // +1 para o caractere de nova linha
        }
        
        // Extrair o contexto (algumas linhas antes e depois)
        const contextStart = Math.max(0, lineNumber - 3);
        const contextEnd = Math.min(contentLines.length, lineNumber + 3);
        const context = contentLines.slice(contextStart, contextEnd).join('\n');
        
        console.log(`  - Linha ${lineNumber}:`);
        console.log(`\x1b[33m${context}\x1b[0m`);
        console.log('  ------------------------------');
        
        return match; // Retornar o match original para manter a função de substituição feliz
      });
    } else {
      console.log(`\x1b[32m[OK] ${filePath}\x1b[0m`);
    }
  } catch (error) {
    console.error(`Erro ao processar ${filePath}:`, error);
  }
}

// Função para verificar um diretório recursivamente
function checkDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`Diretório não encontrado: ${dirPath}`);
      return;
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Ignorar node_modules e .next
        if (entry.name !== 'node_modules' && entry.name !== '.next') {
          checkDirectory(fullPath);
        }
      } else if (entry.isFile()) {
        // Verificar apenas arquivos JavaScript/TypeScript/JSX/TSX
        const ext = path.extname(entry.name).toLowerCase();
        if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
          checkFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Erro ao processar diretório ${dirPath}:`, error);
  }
}

// Função principal
function main() {
  console.log('Verificando componentes Link problemáticos...');
  console.log('Isso pode levar alguns momentos, dependendo do tamanho do projeto.\n');
  
  // Verificar os diretórios/arquivos específicos
  for (const pathToCheck of specificPaths) {
    if (fs.existsSync(pathToCheck)) {
      const stats = fs.statSync(pathToCheck);
      if (stats.isDirectory()) {
        checkDirectory(pathToCheck);
      } else if (stats.isFile()) {
        checkFile(pathToCheck);
      }
    } else {
      console.log(`Caminho não encontrado: ${pathToCheck}`);
    }
  }
  
  console.log('\nVerificação concluída!');
  console.log('Instruções para corrigir:');
  console.log('1. Altere <Link href="..."><a ...>Texto</a></Link>');
  console.log('2. Para: <Link href="..." ...>Texto</Link>');
  console.log('3. OU adicione legacyBehavior: <Link href="..." legacyBehavior><a ...>Texto</a></Link>');
}

// Executar
main();