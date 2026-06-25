# Hotel Dashboard

Painel administrativo para gestão de inventário hoteleiro: cadastro, edição, exclusão e
filtragem multi-critério de hotéis, com autenticação exclusiva via Google e persistência
no Firebase. Construído sob **Clean Architecture**, com TypeScript em modo estrito e
cobertura de testes nas camadas de Domínio, Aplicação, Infraestrutura e ponta a ponta.

> Este repositório nasceu de um CRUD simples em Create React App e foi reescrito do zero
> seguindo um processo *spec-driven* (documentos em [`spec-driven/`](./spec-driven)) e um
> roadmap de 4 fases. O código original foi preservado em [`src/legacy/`](./src/legacy)
> como referência histórica, sem nenhuma dependência do app atual sobre ele.

## Índice

- [Stack técnica](#stack-técnica)
- [Arquitetura](#arquitetura)
- [Estrutura de diretórios](#estrutura-de-diretórios)
- [Design System](#design-system)
- [Como rodar localmente](#como-rodar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts disponíveis](#scripts-disponíveis)
- [Estratégia de testes](#estratégia-de-testes)
- [CI/CD](#cicd)
- [Da reescrita: CRA → Vite + Clean Architecture](#da-reescrita-cra--vite--clean-architecture)
- [Regras de segurança do Firestore](#regras-de-segurança-do-firestore)

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Build tool | [Vite 5](https://vitejs.dev) + TypeScript 5 (`strict: true`) |
| UI | React 18, React Router 6 |
| Estilo | Tailwind CSS v4 (tokens de design via `@theme`, modo escuro via classe) |
| Persistência / Auth | Firebase 12 (Firestore + Google Auth) |
| Testes unitários/integração | Vitest + Testing Library + Firebase Emulator Suite |
| Testes E2E | Playwright (3 engines) contra o Firebase Auth Emulator |
| Qualidade estática | ESLint 10 (flat config, `typescript-eslint` strict) + Prettier |
| CI | GitHub Actions |

## Arquitetura

O projeto segue **Clean Architecture**: as regras de negócio (Domínio e Casos de Uso) não
sabem que React, Vite ou Firebase existem. A dependência sempre aponta para dentro.

```
Presentation (React)  ──consome──>  Application (Use Cases)
                                          │ implementa/injeta
                                          v
                                     Domain (Entities, Interfaces)
                                          ^
                                          │ implementa
                              Infrastructure (Firebase)
```

- **`src/domain`** — `Hotel` e `User` (entidades que se auto-validam: preço ≥ 0, estrelas
  1–5, nota 0–10, e-mail válido), e os contratos `IHotelRepository` / `IAuthService`. Zero
  dependência de framework.
- **`src/application`** — Casos de uso (`CreateHotelUseCase`, `UpdateHotelUseCase`,
  `DeleteHotelUseCase`, `GetFilteredHotelsUseCase`, `GetHotelByIdUseCase`,
  `SeedDemoHotelsUseCase`), testados com um `InMemoryHotelRepository` — nenhum teste de
  negócio depende do Firebase.
- **`src/infrastructure`** — `FirebaseHotelRepository` e `FirebaseAuthService`, as únicas
  classes que conhecem o SDK do Firebase. Implementam os contratos do domínio (Dependency
  Inversion), e são resilientes a documentos que não batem com o schema atual (ex.: dados
  herdados de uma versão anterior) em vez de derrubar a aplicação.
- **`src/presentation`** — Componentes "burros" (`components/`), hooks que fazem a ponte
  entre React e os casos de uso (`hooks/useAuth`, `useHotelDashboard`, `useHotel`,
  `useTheme`), páginas (`pages/`) e o *composition root* (`composition/container.ts`) —
  único lugar do app onde Firebase é instanciado e injetado nos casos de uso.

Essa separação permite, por exemplo, trocar `FirebaseHotelRepository` por
`InMemoryHotelRepository` nos testes sem tocar em uma linha da camada de aplicação ou
apresentação (Liskov Substitution).

## Estrutura de diretórios

```
src/
├── domain/            # Entidades + contratos de repositório (puro TS)
├── application/       # Casos de uso
├── infrastructure/
│   └── firebase/      # Adapters concretos (Firestore, Auth)
├── presentation/
│   ├── components/    # Design System (Button, Input, HotelCard, ConfirmDialog...)
│   ├── hooks/         # useAuth, useHotelDashboard, useHotel, useTheme
│   ├── pages/         # LoginPage, DashboardPage, CreateHotelPage, HotelDetailsPage...
│   ├── composition/   # Injeção de dependências (container.ts)
│   └── styles/        # global.css — design tokens Tailwind (claro/escuro)
├── test/
│   ├── doubles/       # InMemoryHotelRepository, InMemoryAuthService
│   └── integration/   # Helpers para o Firebase Emulator Suite
└── legacy/            # App CRA original — não importado por nada acima
e2e/                   # Specs Playwright + helpers de login via Auth Emulator
spec-driven/           # PRD, Architecture, Design, Plan-Test, Roadmap, Pipeline
```

## Design System

Os tokens visuais (paleta, tipografia, raio de borda, sombra) vivem em
[`src/presentation/styles/global.css`](./src/presentation/styles/global.css) como
variáveis Tailwind v4 (`@theme`). Identidade premium-hospitality: tipografia serifada
(*Playfair Display*) para títulos, *Inter* para interface, acento em azul profundo e
destaques de avaliação em âmbar.

**Modo claro/escuro** é resolvido inteiramente por *re-definição dos mesmos tokens* sob a
classe `.dark` no `<html>` — nenhum componente precisa de variantes `dark:` espalhadas
(exceto para cores literais fora do sistema de tokens, como o skeleton de carregamento). O
hook [`useTheme`](./src/presentation/hooks/useTheme.ts) persiste a preferência em
`localStorage` e respeita `prefers-color-scheme` no primeiro acesso.

## Como rodar localmente

```bash
npm install
cp .env.example .env   # preencha com as credenciais do seu projeto Firebase
npm run dev
```

Acesse `http://localhost:5173`.

### Rodando contra o Firebase Emulator (recomendado para desenvolvimento)

Evita gravar dados de teste no projeto real e não exige credenciais reais:

```bash
npx firebase emulators:start --only firestore,auth
```

No `.env`, use credenciais fictícias e ative o emulador:

```env
VITE_FIREBASE_API_KEY=test-api-key
VITE_FIREBASE_PROJECT_ID=demo-hotel-dashboard
VITE_USE_FIREBASE_EMULATOR=true
```

Com o emulador no ar, o login com Google abre o seletor de contas fictícias do próprio
Auth Emulator (nenhuma conta real necessária).

## Variáveis de ambiente

Veja [`.env.example`](./.env.example). Nenhuma credencial é commitada — `.env` está no
`.gitignore`, assim como qualquer `*firebase-adminsdk*.json` (Service Account Keys usadas
apenas em scripts administrativos pontuais, nunca versionadas).

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Typecheck + build de produção |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | ESLint, `--max-warnings 0` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier `--write` |
| `npm run test:unit` | Vitest (Domínio + Aplicação + Apresentação), com cobertura mínima de 85% em Domínio/Aplicação |
| `npm run test:integration` | Sobe o Firebase Emulator e roda os testes de `src/infrastructure` contra ele |
| `npm run test:e2e` | Sobe o Firebase Emulator e roda a suíte Playwright completa |

## Estratégia de testes

Pirâmide de testes alinhada ao `spec-driven/PLAN-TEST.md`:

1. **Unitários (Vitest)** — Entidades de domínio e Casos de Uso, isolados via
   `InMemoryHotelRepository` / `InMemoryAuthService`. Cobertura ≥ 85% em
   `src/domain` e `src/application`.
2. **Hooks (Vitest + Testing Library)** — `useAuth` e `useHotelDashboard` testados com
   `renderHook`, validando transições `loading` → `success`/`error` e reação a mudanças de
   filtro, sem nenhuma dependência real do Firebase.
3. **Integração (Vitest + Firebase Emulator Suite)** — `FirebaseHotelRepository` e
   `FirebaseAuthService` contra um Firestore/Auth real (emulado), validando inclusive que
   as `firestore.rules` bloqueiam escrita não autenticada.
4. **E2E (Playwright)** — Fluxo de autenticação (via o seletor de contas do Auth Emulator,
   não um mock), CRUD completo de hotel (criar → aparece no grid → editar → excluir com
   dupla confirmação → desaparece) e filtros combinados levando ao estado vazio.

## CI/CD

[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) roda em todo push/PR para
`main`: lint → typecheck → testes unitários → testes de integração (Firebase Emulator) →
instalação dos browsers do Playwright → testes E2E → build de produção. Nenhuma etapa é
opcional — qualquer falha bloqueia o merge.

## Da reescrita: CRA → Vite + Clean Architecture

O projeto original era um CRUD direto sobre `react-scripts`, com chamadas ao Firestore
feitas dentro dos próprios componentes, tipos `any` ocasionais e credenciais do Firebase
hardcoded no código-fonte. A modernização seguiu 4 fases:

1. **Fundação** — migração de CRA para Vite, TypeScript em modo estrito, ESLint/Prettier,
   Vitest/Playwright e a árvore de diretórios de Clean Architecture. O código antigo foi
   movido para `src/legacy/` em vez de apagado, preservando o histórico.
2. **Domínio isolado** — entidades `Hotel`/`User` com auto-validação e os 4 casos de uso
   centrais, escritos via TDD, 100% livres de Firebase.
3. **Infraestrutura** — `FirebaseHotelRepository`/`FirebaseAuthService` implementando os
   contratos do domínio; credenciais movidas para variáveis de ambiente; testes de
   integração reais contra o Firebase Emulator Suite (não mocks).
4. **Apresentação** — Design System em Tailwind, hooks de ponte React↔casos de uso,
   páginas completas e a suíte E2E real. Nessa fase também foram corrigidos dados legados
   no Firestore de produção (schema antigo incompatível com a nova entidade `Hotel`) via
   um script administrativo pontual (Firebase Admin SDK, executado e descartado
   localmente — nunca commitado) e adicionados modo claro/escuro, navegação de volta nas
   telas de detalhe e um caso de uso `SeedDemoHotelsUseCase` para restaurar o catálogo de
   demonstração a qualquer momento pela própria interface.

## Regras de segurança do Firestore

[`firestore.rules`](./firestore.rules) exige `request.auth != null` para qualquer leitura
ou escrita na coleção `hotels`, validado tanto no Emulator Suite (testes de integração)
quanto implantado no projeto real via `firebase deploy --only firestore:rules`.
