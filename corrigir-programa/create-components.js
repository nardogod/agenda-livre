// create-components.js
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

// Importar os templates
const templates = require('./templates');

// Diretório raiz do projeto
const projectRoot = path.join(process.cwd(), '..');

// Componentes disponíveis para criação
const availableComponents = [
  { name: 'ServiceCard', path: 'src/components/booking/ServiceCard.tsx', template: templates.ServiceCardTemplate },
  { name: 'TimeSlot', path: 'src/components/booking/TimeSlot.tsx', template: templates.TimeSlotTemplate },
  { name: 'ToggleOption', path: 'src/components/booking/ToggleOption.tsx', template: templates.ToggleOptionTemplate },
  { name: 'RadioOption', path: 'src/components/booking/RadioOption.tsx', template: templates.RadioOptionTemplate },
  { name: 'BookingSummary', path: 'src/components/booking/BookingSummary.tsx', template: templates.BookingSummaryTemplate },
  { name: 'PaymentMethod', path: 'src/components/booking/PaymentMethod.tsx', template: templates.PaymentMethodTemplate },
  { name: 'ClientForm', path: 'src/components/booking/ClientForm.tsx', template: templates.ClientFormTemplate },
  { name: 'DateSelector', path: 'src/components/booking/DateSelector.tsx', template: templates.DateSelectorTemplate },
  { name: 'PaymentForm', path: 'src/components/booking/PaymentForm.tsx', template: templates.PaymentFormTemplate },
  { name: 'HomePage', path: 'src/pages/index.tsx', template: templates.IndexPageTemplate },
  { name: 'LoginPage', path: 'src/pages/auth/login.tsx', template: templates.LoginPageTemplate },
  { name: 'RegisterPage', path: 'src/pages/auth/register.tsx', template: templates.RegisterPageTemplate },
  { name: 'ProfessionalDetailPage', path: 'src/pages/professionals/[id].tsx', template: templates.ProfessionalDetailPageTemplate },
  { name: 'BookingIndexPage', path: 'src/pages/booking/[professionalId]/index.tsx', template: templates.BookingIndexPageTemplate }
];

// Interface de linha de comando
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para criar um componente
function createComponent(component) {
  const filePath = path.join(projectRoot, component.path);
  const dir = path.dirname(filePath);
  
  // Criar diretório se não existir
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Diretório criado: ${dir}`);
  }
  
  // Verificar se o arquivo já existe
  if (fs.existsSync(filePath)) {
    console.log(`O arquivo já existe: ${component.path}`);
    return false;
  }
  
  // Criar o arquivo com o template
  fs.writeFileSync(filePath, component.template, 'utf8');
  console.log(`Componente criado: ${component.path}`);
  return true;
}

// Função para criar todos os componentes
function createAllComponents() {
  let created = 0;
  let skipped = 0;
  
  availableComponents.forEach(component => {
    if (createComponent(component)) {
      created++;
    } else {
      skipped++;
    }
  });
  
  console.log(`\nResumo: ${created} componentes criados, ${skipped} já existentes.`);
  rl.close();
}

// Função para criar componentes selecionados
function createSelectedComponents() {
  console.log('\nComponentes disponíveis:');
  availableComponents.forEach((component, index) => {
    console.log(`${index + 1}. ${component.name}`);
  });
  
  rl.question('\nDigite os números dos componentes que deseja criar (separados por vírgula) ou "todos" para criar todos: ', (answer) => {
    if (answer.toLowerCase() === 'todos') {
      createAllComponents();
      return;
    }
    
    const selections = answer.split(',').map(s => s.trim());
    let created = 0;
    let skipped = 0;
    
    selections.forEach(selection => {
      const index = parseInt(selection) - 1;
      if (isNaN(index) || index < 0 || index >= availableComponents.length) {
        console.log(`Seleção inválida: ${selection}`);
        return;
      }
      
      const component = availableComponents[index];
      if (createComponent(component)) {
        created++;
      } else {
        skipped++;
      }
    });
    
    console.log(`\nResumo: ${created} componentes criados, ${skipped} já existentes.`);
    rl.close();
  });
}

// Iniciar o processo
console.log('Criação de Componentes do Agenda Livre');
console.log('=====================================');

createSelectedComponents();