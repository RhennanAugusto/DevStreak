# 🏗️ Diagrama de Arquitetura - DevStreak

## Arquitetura MVC - Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                         VIEW LAYER                           │
│                    (React Components)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  index.tsx   │  │  metas.tsx   │  │sequencias.tsx │     │
│  │  (Lista)     │  │  (Criar)     │  │  (Ranking)    │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│         └─────────────────┼──────────────────┘              │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │  auth.tsx   │                          │
│                    │  (Login)    │                          │
│                    └──────┬──────┘                          │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            │ useAuth() Hook
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                    CONTROLLER LAYER                          │
│              (Business Logic Orchestration)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │ MetaController   │  │SequenciaController│                │
│  │                  │  │                  │                 │
│  │ • buscarMetas() │  │ • calcularStreak │                 │
│  │ • criarMeta()   │  │ • ranking()      │                 │
│  │ • deletarMeta() │  │                  │                 │
│  │ • completarMeta │  └──────────────────┘                 │
│  └────────┬────────┘                                         │
│           │                                                   │
│  ┌────────▼────────┐                                        │
│  │RealtimeController│                                        │
│  │                  │                                        │
│  │ • subscribe()   │                                        │
│  └──────────────────┘                                        │
│                                                               │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ Uses
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                      SERVICE LAYER                           │
│              (Data Access & API Communication)               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  MetaService    │  │CompletionService │                 │
│  │                  │  │                  │                 │
│  │ • listar()      │  │ • listar()       │                 │
│  │ • criar()       │  │ • criar()        │                 │
│  │ • atualizar()   │  │ • listarHoje()   │                 │
│  │ • deletar()     │  │                  │                 │
│  └────────┬────────┘  └────────┬─────────┘                 │
│           │                    │                             │
│           └──────────┬─────────┘                             │
│                      │                                       │
└──────────────────────┼───────────────────────────────────────┘
                       │
                       │ Uses
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                    DATA LAYER                                │
│                  (Appwrite SDK)                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────┐           │
│  │         Appwrite Client                      │           │
│  │                                              │           │
│  │  • Account (Auth)                           │           │
│  │  • Databases (CRUD)                        │           │
│  │  • Realtime (Subscriptions)                │           │
│  └──────────────────────────────────────────────┘           │
│                                                               │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                    CLOUD SERVICES                             │
│                      (Appwrite)                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth API   │  │  Database   │  │   Realtime   │      │
│  │              │  │              │  │              │      │
│  │ • Login      │  │ • Collections│  │ • Events     │      │
│  │ • Register   │  │ • Documents  │  │ • Channels   │      │
│  │ • Sessions   │  │ • Queries    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Fluxo de Criação de Meta

```
User Input (metas.tsx)
    │
    │ handleSubmit()
    ▼
MetaController.criarMeta()
    │
    │ Valida e prepara dados
    ▼
MetaService.criar()
    │
    │ Appwrite SDK
    ▼
Appwrite Database API
    │
    │ Success
    ▼
Realtime Event (create)
    │
    │ Subscription
    ▼
RealtimeController.subscribeToHabits()
    │
    │ Callback
    ▼
index.tsx.fetchHabits()
    │
    │ Update State
    ▼
UI Updates Automatically
```

## Fluxo de Autenticação

```
AuthScreen (auth.tsx)
    │
    │ handleAuth()
    ▼
useAuth().signIn() / signUp()
    │
    │ AuthContext
    ▼
AuthProvider.signIn()
    │
    │ Appwrite Account API
    ▼
account.createEmailPasswordSession()
    │
    │ Success
    ▼
account.get() → setUser()
    │
    │ Context Update
    ▼
All Components Re-render
    │
    │ Protected Route Check
    ▼
app/index.tsx → Redirect to /(tabs)
```

## Padrões de Projeto Aplicados

### 1. MVC (Model-View-Controller)
- **Model**: `types/database_type.ts` (Interfaces)
- **View**: `app/**/*.tsx` (React Components)
- **Controller**: `controllers/*.ts` (Business Logic)

### 2. Repository Pattern
- **Services** encapsulam acesso a dados
- Abstração da implementação do Appwrite

### 3. Dependency Injection
- Controllers recebem Services via constructor
- Facilita testes e manutenção

### 4. Observer Pattern
- Realtime subscriptions do Appwrite
- Views reagem a mudanças de dados

### 5. Provider Pattern
- AuthProvider compartilha estado global
- Context API do React

### 6. Singleton Pattern
- Appwrite Client configurado uma vez
- Reutilizado em todo o projeto

## Separação de Responsabilidades

### View Layer
- **Responsabilidade**: Apresentação e interação com usuário
- **Não deve**: Acessar banco diretamente, conter lógica de negócio complexa

### Controller Layer
- **Responsabilidade**: Orquestrar operações, aplicar regras de negócio
- **Não deve**: Acessar banco diretamente, conter lógica de apresentação

### Service Layer
- **Responsabilidade**: Comunicação com APIs externas, acesso a dados
- **Não deve**: Conter lógica de negócio, conhecer detalhes de UI

### Data Layer
- **Responsabilidade**: Configuração e abstração do Appwrite SDK
- **Não deve**: Conter lógica de negócio ou apresentação

## Princípios SOLID Aplicados

### S - Single Responsibility Principle ✅
- Cada classe tem uma única responsabilidade
- `MetaService`: Apenas CRUD de metas
- `MetaController`: Apenas orquestração

### O - Open/Closed Principle ✅
- Classes podem ser estendidas sem modificação
- Services podem ter novos métodos sem alterar existentes

### L - Liskov Substitution Principle ✅
- Interfaces bem definidas permitem substituição
- Services podem ser mockados em testes

### I - Interface Segregation Principle ✅
- Interfaces específicas e focadas
- `StreakData`, `MetaComStreak` bem definidas

### D - Dependency Inversion Principle ✅
- Controllers dependem de abstrações (Services)
- Não dependem de implementações concretas do Appwrite

