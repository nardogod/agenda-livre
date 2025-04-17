// check-specific-links.js
// Este script verifica componentes Link problemáticos apenas nos arquivos específicos

const fs = require('fs');
const path = require('path');

// Lista específica de arquivos e diretórios a serem verificados
const specificFiles = [
  // Arquivos específicos que você compartilhou (caminho completo para verificação)
  'components/layout/BottomNav.tsx',
  'components/layout/Header.tsx', 
  'components/layout/Layout.tsx',
  'components/layout/MainLayout.tsx',
  'components/professionals/ProfessionalsList.tsx',
  
  // Diretórios com componentes potencialmente problemáticos
  'src/components/booking',
  'src/components/professionals'
];

// Expressão regular para encontrar componentes Link com tag <a> como filho direto
const linkWithAnchorRegex = /<Link\s+([^>]*?)>\s*<a([^>]*?)>/g;

// Função para verificar um arquivo
function checkFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`Arquivo não encontrado: ${filePath}`);
      return false;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(linkWithAnchorRegex);
    
    if (matches && matches.length > 0) {
      console.log(`\x1b[31m[PROBLEMA] ${filePath}: ${matches.length} componentes Link problemáticos\x1b[0m`);
      
      // Extrair e mostrar contexto para cada problema
      let contentLines = content.split('\n');
      let problemLines = [];
      
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
        
        problemLines.push(lineNumber);
        
        // Extrair o contexto (algumas linhas antes e depois)
        const contextStart = Math.max(0, lineNumber - 2);
        const contextEnd = Math.min(contentLines.length, lineNumber + 2);
        const context = contentLines.slice(contextStart, contextEnd).join('\n');
        
        console.log(`  - Linha ${lineNumber}:`);
        console.log(`\x1b[33m${context}\x1b[0m`);
        console.log('  ------------------------------');
        
        return match; // Retornar o match original
      });
      
      // Sugerir correção para cada problema
      console.log(`\n  Como corrigir em ${filePath}:`);
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        let fixed = match.replace(linkWithAnchorRegex, (fullMatch, linkProps, aProps) => {
          // Extrair atributos da tag <a>
          const aAttrs = aProps.match(/(\w+)=["']([^"']*)["']/g) || [];
          const aAttrsObj = {};
          
          aAttrs.forEach(attr => {
            const [key, value] = attr.split('=');
            aAttrsObj[key] = value.replace(/["']/g, '');
          });
          
          // Construir nova tag Link com os atributos combinados
          let newLinkProps = linkProps;
          Object.keys(aAttrsObj).forEach(key => {
            if (!newLinkProps.includes(`${key}=`)) {
              newLinkProps += ` ${key}=${aAttrsObj[key]}`;
            }
          });
          
          return `<Link ${newLinkProps.trim()}>`;
        });
        
        fixed = fixed.replace('</a></Link>', '</Link>');
        
        console.log(`  Original: ${match}`);
        console.log(`  Corrigido: ${fixed}`);
        console.log('  ------------------------------');
      }
      
      return true;
    } else {
      console.log(`\x1b[32m[OK] ${filePath}\x1b[0m`);
      return false;
    }
  } catch (error) {
    console.error(`Erro ao processar ${filePath}:`, error);
    return false;
  }
}

// Função para verificar um diretório recursivamente
function checkDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`Diretório não encontrado: ${dirPath}`);
      return 0;
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    let problemCount = 0;
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Ignorar node_modules e .next
        if (entry.name !== 'node_modules' && entry.name !== '.next') {
          problemCount += checkDirectory(fullPath);
        }
      } else if (entry.isFile()) {
        // Verificar apenas arquivos JavaScript/TypeScript/JSX/TSX
        const ext = path.extname(entry.name).toLowerCase();
        if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
          if (checkFile(fullPath)) {
            problemCount++;
          }
        }
      }
    }
    
    return problemCount;
  } catch (error) {
    console.error(`Erro ao processar diretório ${dirPath}:`, error);
    return 0;
  }
}

// Função principal
function main() {
  console.log('Verificando componentes Link problemáticos em arquivos específicos...\n');
  
  let totalProblems = 0;
  
  // Verificar arquivos individuais
  for (const pathToCheck of specificFiles) {
    if (fs.existsSync(pathToCheck)) {
      const stats = fs.statSync(pathToCheck);
      if (stats.isDirectory()) {
        totalProblems += checkDirectory(pathToCheck);
      } else if (stats.isFile()) {
        if (checkFile(pathToCheck)) {
          totalProblems++;
        }
      }
    } else {
      console.log(`Caminho não encontrado: ${pathToCheck}`);
    }
  }
  
  console.log('\nVerificação concluída!');
  
  if (totalProblems > 0) {
    console.log(`\x1b[31mForam encontrados problemas em ${totalProblems} arquivos.\x1b[0m`);
    console.log('\nPara cada problema, você pode:');
    console.log('1. Mover os atributos da tag <a> para a tag <Link>');
    console.log('2. Remover a tag <a> completamente');
    console.log('3. OU adicionar legacyBehavior à tag <Link>');
  } else {
    console.log('\x1b[32mNão foram encontrados problemas nos arquivos verificados!\x1b[0m');
    console.log('O erro pode estar em outro arquivo do projeto.');
  }
}

// Executar
main();