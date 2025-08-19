# Agenda Livre - Plataforma de Agendamento de Serviços (Portfólio)

![Next JS](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)


---

## ⚠️ Disclaimer: Projeto Descontinuado - Peça de Portfólio

Este projeto foi desenvolvido como um estudo prático e uma **demonstração de habilidades na construção de uma aplicação web moderna com Next.js e TypeScript**. Ele **não se encontra mais em desenvolvimento ativo** e serve como uma vitrine das tecnologias e arquiteturas com as quais tive contato.

O objetivo principal é apresentar competências na criação de uma interface reativa e bem estruturada, incluindo: um sistema de autenticação robusto com rotas protegidas, gerenciamento de estado global com React Context, design responsivo com Tailwind CSS, e a arquitetura de uma plataforma com múltiplos tipos de usuários (Clientes e Profissionais).

---

## 📖 Sobre o Projeto

O "Agenda Livre" é um protótipo funcional de uma plataforma de agendamento de serviços. A ideia central é conectar clientes que precisam de um serviço a profissionais qualificados, facilitando a busca, o agendamento e a gestão de horários para ambas as partes.

O sistema foi projetado desde o início para ter áreas distintas e funcionalidades específicas para cada tipo de usuário, com dashboards personalizados.

## ✨ Funcionalidades Implementadas

-   **Sistema de Autenticação Completo:**
    -   Registro, login e logout utilizando **JSON Web Tokens (JWT)**.
    -   Persistência de sessão no lado do cliente (`localStorage`) para manter o usuário logado.
    -   Fluxos de autenticação distintos para **Clientes** e **Profissionais**.
-   **Gerenciamento de Estado Global:**
    -   Uso do **React Context API** para gerenciar o estado de autenticação do usuário, disponibilizando informações como `user`, `isAuthenticated` e `isProfessional` para toda a aplicação.
-   **Rotas Protegidas e Redirecionamento:**
    -   Criação de um High-Order Component (HOC) `ProtectedProfessionalRoute` para proteger páginas específicas do dashboard.
    -   Redirecionamento automático de usuários não autorizados para a página de login.
    -   Redirecionamento pós-login para o dashboard correspondente ao tipo de usuário.
-   **Dashboard do Profissional:**
    -   Estrutura de layout reutilizável (`ProfessionalDashboardLayout`).
    -   Página de **Configurações de Notificações** implementada, permitindo ao profissional gerenciar como e quando deseja ser notificado (via Push, Email, SMS) sobre eventos como novos agendamentos, lembretes e cancelamentos.
-   **UI/UX:**
    -   Interface construída com **Tailwind CSS** para um design moderno e responsivo.
    -   Uso da biblioteca **`lucide-react`** para iconografia.
    -   Sistema de feedback ao usuário com notificações (Toast).

## 🛠️ Stack de Tecnologias

#### Frontend
*   **Linguagem:** TypeScript
*   **Framework:** Next.js 13+ (com App Router ou Pages Router)
*   **Biblioteca Principal:** React 18+
*   **Gerenciamento de Estado:** React Context API
*   **Roteamento:** Roteamento baseado em arquivos do Next.js (`useRouter`)
*   **Requisições HTTP:** Camada de serviço (`authService`) para abstrair chamadas à API (utilizando `fetch` ou `axios`).
*   **Estilização:** Tailwind CSS
*   **Componentes de UI:** Componentes customizados e bibliotecas de ícones como `lucide-react`.

#### Backend (Abstraído)
*   O frontend foi construído para consumir uma **API RESTful** externa para autenticação e gerenciamento de dados. O código demonstra flexibilidade ao lidar com diferentes nomenclaturas de campos da API (ex: `userType` vs `user_type`).

#### Ferramentas e Qualidade de Código
*   **Controle de Versão:** Git & GitHub
*   **Gerenciador de Pacotes:** NPM
*   **Testes de Acessibilidade:** Uso do `axe-core` para garantir a conformidade com as diretrizes de acessibilidade.

## 🏛️ Arquitetura

-   **Frontend com Next.js:** A aplicação é focada no frontend, utilizando o poder do Next.js para renderização e roteamento.
-   **Arquitetura Baseada em Componentes:** O código é organizado em componentes reutilizáveis, layouts e páginas, seguindo as melhores práticas do React.
-   **Camada de Serviços:** A lógica de comunicação com a API é isolada em uma camada de serviço (`services/auth.ts`), desacoplando a lógica de negócio da interface do usuário.
-   **Tipagem Estática Forte:** O uso extensivo de **TypeScript** garante a segurança de tipos, melhora a manutenibilidade e a experiência de desenvolvimento.

## 🚀 Como Executar o Projeto Localmente

#### Pré-requisitos
-   Node.js 16+ e NPM
-   Git

#### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/agenda-livre.git
cd agenda-livre
```

#### 2. Instale as dependências
```bash
npm install
```

#### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto. Este arquivo é necessário para definir a URL da API que o frontend irá consumir.
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
**Observação:** As funcionalidades que dependem de dados do backend (como login, registro e carregamento de dados do dashboard) exigem que uma API compatível esteja em execução no endereço especificado.

#### 4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```
O frontend estará acessível em `http://localhost:3000`.

## 🏁 Status Final e Próximos Passos (se o projeto continuasse)

O projeto foi interrompido com uma base sólida e funcional, especialmente no que tange à autenticação e à estrutura do dashboard do profissional.

Os próximos passos naturais para a evolução do projeto seriam:

1.  **Integração Total com a API:** Conectar os componentes de UI (como o formulário de configurações de notificação) aos endpoints do backend para persistir os dados.
2.  **Desenvolvimento do Dashboard do Cliente:** Construir a interface para os clientes, incluindo funcionalidades de busca por profissionais, visualização de perfis e agendamento de serviços.
3.  **Implementação do Core de Agendamento:** Desenvolver os componentes de calendário, seleção de horários e a lógica de confirmação de agendamentos.
4.  **Testes Unitários e de Integração:** Adicionar uma suíte de testes com **Jest** e **React Testing Library** para garantir a estabilidade e a qualidade do código.
5.  **Deploy:** Publicar a aplicação Next.js em uma plataforma como **Vercel** ou **Netlify** para disponibilizá-la online.

