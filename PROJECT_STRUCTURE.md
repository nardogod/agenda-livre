# Estrutura do Projeto Agenda Livre

Este documento descreve a estrutura padronizada do projeto Agenda Livre, seguindo as melhores práticas para aplicações Next.js.

## Abordagem de Roteamento

Este projeto usa o **Pages Router** do Next.js, que é a abordagem tradicional de roteamento baseada em arquivos.

## Estrutura de Diretórios

```
agenda-livre/
├── public/                  # Arquivos estáticos
│   ├── assets/              # Imagens, ícones e outros recursos
│   └── service-worker.js    # Service worker para notificações push
├── src/                     # Código-fonte da aplicação
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── analytics/       # Componentes relacionados a análises
│   │   ├── booking/         # Componentes de agendamento
│   │   ├── calendar/        # Componentes de integração com calendário
│   │   ├── layout/          # Componentes de layout (ex: sidebar, navbar)
│   │   ├── notifications/   # Componentes de notificações
│   │   ├── professionals/   # Componentes relacionados a profissionais
│   │   ├── reviews/         # Componentes de avaliações
│   │   └── ui/              # Componentes de UI genéricos
│   ├── contexts/            # Contextos React para gerenciamento de estado
│   ├── hooks/               # React hooks personalizados
│   ├── pages/               # Páginas da aplicação (roteamento)
│   │   ├── _app.tsx         # Componente App personalizado
│   │   ├── _document.tsx    # Componente Document personalizado
│   │   ├── api/             # Rotas de API
│   │   ├── auth/            # Páginas de autenticação
│   │   ├── dashboard/       # Páginas de dashboard
│   │   └── ...              # Outras páginas
│   ├── services/            # Serviços de API e integrações externas
│   ├── styles/              # Estilos globais e configurações CSS
│   ├── types/               # Definições de tipos TypeScript
│   └── utils/               # Funções utilitárias
├── .eslintrc.js             # Configuração do ESLint
├── .gitignore               # Arquivos a serem ignorados pelo Git
├── next.config.js           # Configuração do Next.js
├── package.json             # Dependências e scripts
├── postcss.config.js        # Configuração do PostCSS
├── README.md                # Documentação principal
├── tailwind.config.js       # Configuração do Tailwind CSS
└── tsconfig.json            # Configuração do TypeScript
```

## Padrões de Nomenclatura

- **Arquivos de Componentes**: Use PascalCase (ex: `Button.tsx`, `UserProfile.tsx`)
- **Arquivos de Utilitários**: Use camelCase (ex: `formatDate.ts`, `validationUtils.ts`)
- **Arquivos de Página**: Use kebab-case para facilitar URLs amigáveis (ex: `user-profile.tsx`)
- **Arquivos de Contexto**: Adicione o sufixo `Context` (ex: `AuthContext.tsx`)
- **Arquivos de Hook**: Adicione o prefixo `use` (ex: `useAuth.ts`)

## Recomendações de Desenvolvimento

1. **Importações**: Organize importações em grupos lógicos:
   - Bibliotecas externas
   - Componentes
   - Hooks
   - Utilitários
   - Estilos

2. **TypeScript**: Use tipos para todas as props, estados e retornos de funções.

3. **Componentes**:
   - Prefira componentes funcionais com hooks
   - Use React.memo para componentes que renderizam frequentemente
   - Separe lógica de UI quando possível

4. **Estado**:
   - Use contextos para estado global
   - Use hooks (useState, useReducer) para estado local
   - Considere React Query para estado servidor/cache

5. **Estilos**:
   - Use classes Tailwind para a maioria dos estilos
   - Use CSS Modules para estilos complexos ou dinâmicos

6. **Commits e PRs**:
   - Faça commits pequenos e significativos
   - Descreva claramente as alterações nas mensagens de commit
   - Mantenha PRs focados em uma única funcionalidade ou correção

Para mais detalhes sobre padrões específicos, consulte a documentação interna.
