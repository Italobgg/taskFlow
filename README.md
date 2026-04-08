✅ TaskFlow
Um gerenciador de tarefas moderno e intuitivo, construído com as tecnologias mais recentes do ecossistema React.

React TypeScript Tailwind CSS Vite Vitest

✨ Funcionalidades
➕ Criar tarefas com título e descrição
✏️ Editar tarefas existentes inline
🗑️ Excluir tarefas com confirmação
✅ Marcar como concluída com um clique
🔍 Filtrar tarefas por status (todas, pendentes, concluídas)
📊 Contadores dinâmicos de tarefas por status
💾 Persistência automática com LocalStorage
📱 Design responsivo (mobile-first)
♿ Acessibilidade com suporte a teclado e leitores de tela
🛠️ Tecnologias



Tecnologia	Versão	Descrição
React	19.x	Biblioteca para construção de interfaces
TypeScript	5.7+	Superset JavaScript com tipagem estática
Tailwind CSS	4.x	Framework CSS utility-first
Vite	6.x	Build tool e dev server ultrarrápido
Vitest	3.x	Framework de testes unitários
Testing Library	16.x	Utilitários para testes de componentes
Lucide React	0.x	Biblioteca de ícones moderna
📁 Estrutura do Projeto


taskFlow/
├── src/
│   ├── components/          # Componentes React
│   │   ├── EmptyState.tsx
│   │   ├── TaskFilters.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskItem.tsx
│   │   └── TaskList.tsx
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useTasks.ts
│   │   └── __tests__/
│   │
│   ├── types/               # Definições de tipos
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── __tests__/               # Testes de componentes
├── vitest.config.ts
└── package.json
🚀 Como Executar
Pré-requisitos
Node.js (v18 ou superior)
npm, yarn ou pnpm
Instalação
Clone o repositório
bash


git clone https://github.com/Italobgg/taskFlow.git
cd taskFlow
Instale as dependências
bash


npm install
Execute o projeto
bash


npm run dev
Acesse no navegador


http://localhost:5173
📜 Scripts Disponíveis



Comando	Descrição
npm run dev	Inicia o servidor de desenvolvimento
npm run build	Gera a build de produção
npm run preview	Visualiza a build de produção
npm run lint	Executa o ESLint
npm test	Executa os testes
npm run test:ui	Executa testes com interface visual
npm run test:coverage	Executa testes com relatório de cobertura
npm run test:watch	Executa testes em modo watch
🧪 Testes
O projeto utiliza Vitest + React Testing Library para garantir qualidade e confiabilidade.

bash


# Executar todos os testes
npm test

# Modo watch
npm run test:watch

# Com interface visual
npm run test:ui

# Com cobertura
npm run test:coverage
Cobertura



Módulo	Testado
Components	TaskForm, TaskItem, TaskList, TaskFilters, EmptyState
Hooks	useTasks, useLocalStorage
🤝 Como Contribuir
Fork o projeto
Crie sua branch (git checkout -b feature/minha-feature)
Commit suas alterações (git commit -m "feat: adiciona feature")
Push para a branch (git push origin feature/minha-feature)
Abra um Pull Request

👤 Autor
Feito com ❤️ por Italo