# Sistema de Gerenciamento de Tarefas

## Tecnologias Utilizadas

- **NextJS 15** - Framework React com App Router
- **tRPC** - API type-safe para comunicação cliente-servidor
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **React Query** - Gerenciamento de estado servidor
- **Superjson** - Serialização de dados

## Estrutura do Projeto

```

src/
├── app/                         # App Router (NextJS 15)
│   ├── api/trpc/[trpc]/
│   │   └── route.ts             # API Handler tRPC
│   ├── tasks/
│   │   ├── create/
│   │   │   └── page.tsx         # Página criar tarefa
│   │   ├── edit/[id]/
│   │   │   └── page.tsx         # Página editar tarefa
│   │   ├── TaskForm.tsx         # Componente formulário
│   │   ├── TaskList.tsx         # Lista com infinite scroll
│   │   └── page.tsx             # Página listagem (SSR)
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Estilos globais
├── server/                      # Backend tRPC
│   ├── api/
│   │   ├── routers/
│   │   │   └── tasks.ts         # Router de tarefas
│   │   ├── root.ts              # Router principal
│   │   └── trpc.ts              # Configuração tRPC
│   └── db.ts                    # Banco em memória
└── trpc/
    └── react.tsx                # Provider React/tRPC
package.json
tailwind.config.ts
tsconfig.json
next.config.js
README.md
```

## Como Executar

### 1. **Executar em desenvolvimento:**

```bash
npm run dev
```

### 2. **Acessar a aplicação:**

```
http://localhost:3000
```

## Fluxo de Uso

1. **Homepage**: Página inicial com navegação para tarefas
2. **Lista de Tarefas**: Visualização com SSR e infinite scroll
3. **Criar Tarefa**: Formulário validado para nova tarefa
4. **Editar Tarefa**: Formulário pré-preenchido para edição
5. **Excluir Tarefa**: Confirmação antes da exclusão

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm run start

# Linting
npm run lint
```

## Troubleshooting

### **Erro de dependências**

```bash
rm -rf node_modules package-lock.json
npm install
```

### **Erro de tipos TypeScript**

```bash
npx tsc --noEmit
```

---

**Desenvolvido usando NextJS 15 + tRPC**
