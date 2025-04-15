// fix-index.js
const fs = require('fs');
const path = require('path');

// Caminho para o arquivo index.tsx na pasta pages
const indexPath = path.join('pages', 'index.tsx');

// Conteúdo correto para o arquivo
const correctContent = `// Redirecionamento automático para o componente canônico
// Este arquivo foi gerado automaticamente para resolver duplicações
export { default } from "../src";
`;

try {
  // Verificar se o arquivo existe
  if (fs.existsSync(indexPath)) {
    // Escrever o conteúdo correto no arquivo
    fs.writeFileSync(indexPath, correctContent, 'utf8');
    console.log('✅ Arquivo pages/index.tsx corrigido com sucesso!');
  } else {
    console.error('❌ Arquivo pages/index.tsx não encontrado!');
    
    // Verificar se o diretório pages existe
    if (!fs.existsSync('pages')) {
      console.log('📁 Criando diretório pages...');
      fs.mkdirSync('pages', { recursive: true });
    }
    
    // Criar o arquivo index.tsx
    fs.writeFileSync(indexPath, correctContent, 'utf8');
    console.log('✅ Arquivo pages/index.tsx criado com sucesso!');
  }
} catch (error) {
  console.error('❌ Erro ao processar o arquivo:', error.message);
}