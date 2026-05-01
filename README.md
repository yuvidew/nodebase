# NodeBase

NodeBase is a modern workflow automation platform built with Next.js, React Flow, Inngest, tRPC, Prisma, Better Auth, and Polar. It lets users create node-based automations, connect triggers to execution nodes, store encrypted AI credentials, run workflows through Inngest, and inspect execution history from a protected dashboard.

The project is similar in spirit to tools like n8n, but it is built as a full-stack TypeScript application with a Next.js App Router frontend, a tRPC API layer, Prisma models for workflow state, and Inngest functions for background execution.

Live demo: https://nodebase-mauve.vercel.app

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Workflow Nodes](#workflow-nodes)
- [Database Schema](#database-schema)
- [Routes and Pages](#routes-and-pages)
- [API and Webhooks](#api-and-webhooks)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Development Notes](#development-notes)

## Features

- Visual workflow editor powered by React Flow.
- Workflow CRUD with search, pagination, rename, delete, save, and execute actions.
- Trigger nodes for manual execution, Google Forms submissions, and Stripe events.
- Execution nodes for HTTP requests, Gemini, OpenAI, Anthropic, Discord, and Slack.
- Background workflow execution through Inngest.
- Realtime execution channels using `@inngest/realtime`.
- Execution history with status, duration, output, errors, and workflow references.
- Better Auth authentication with email/password, GitHub OAuth, and Google OAuth.
- Polar subscription integration for paid/pro workflow and credential creation.
- Encrypted credential storage for AI provider keys.
- Sentry integration for error monitoring.
- Responsive dashboard UI built with shadcn/ui, Radix UI, Tailwind CSS, and lucide icons.
- Theme switching through `next-themes`.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 App Router, React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui, Radix UI, lucide-react, Sonner |
| Workflow editor | `@xyflow/react` / React Flow |
| API | tRPC 11, TanStack React Query, SuperJSON |
| Background jobs | Inngest, `@inngest/realtime` |
| Database | PostgreSQL, Prisma 6 |
| Auth | Better Auth, Prisma adapter, GitHub OAuth, Google OAuth |
| Billing | Polar SDK, `@polar-sh/better-auth` |
| AI SDKs | Vercel AI SDK providers for OpenAI, Anthropic, and Google |
| Monitoring | Sentry for Next.js |
| Dev orchestration | mprocs, dotenv-cli, Inngest CLI, ngrok |

## Project Structure

```text
nodebase/
  prisma/
    schema.prisma              # Database models and Prisma client generator
    migrations/                # Historical database migrations
  public/                      # Logos and provider icons
  src/
    app/                       # Next.js App Router pages and route handlers
    components/                # Shared app, entity, React Flow, provider, and UI components
    config/                    # Shared constants and node-component registry
    features/                  # Feature modules grouped by domain
      auth/                    # Sign-in and sign-up forms
      credentials/             # Credential CRUD and credential hooks
      editor/                  # React Flow editor, save, execute, and editor state
      executions/              # Execution list/detail views and node executors
      subscriptions/           # Polar subscription hooks
      triggers/                # Trigger node UIs and executors
      workflows/               # Workflow CRUD, hooks, params, and router
    generated/prisma/          # Generated Prisma client output
    hooks/                     # Shared React hooks
    inngest/                   # Inngest client, workflow function, utilities, realtime channels
    lib/                       # Auth, DB, encryption, Polar, and utility helpers
    trpc/                      # tRPC client, server, router, and initialization
```

## Architecture

NodeBase is split into a few clear layers:

1. The dashboard UI lives in `src/app` and `src/features`.
2. React Flow stores the editable workflow canvas in the browser.
3. The editor saves nodes and edges through the `workflows.update` tRPC mutation.
4. Prisma persists workflows, nodes, connections, credentials, users, sessions, accounts, and execution records.
5. Workflow execution is triggered through the `workflows.execute` tRPC mutation or webhook route handlers.
6. `sendWorkflowExecution` sends a `workflows/execute.workflow` event to Inngest.
7. Inngest loads the workflow, topologically sorts nodes, resolves the executor for each node type, runs nodes in order, publishes realtime updates, and records success or failure in the `Execution` table.

### Execution Flow

```text
User / Webhook
  -> tRPC mutation or Next.js route handler
  -> sendWorkflowExecution()
  -> Inngest event: workflows/execute.workflow
  -> executeWorkflow function
  -> load workflow nodes and connections from Prisma
  -> topologicalSort(nodes, connections)
  -> getExecutor(node.type)
  -> run each node with shared context
  -> update Execution as SUCCESS or FAILED
```

## Workflow Nodes

Node types are defined in Prisma as `NodeType` and registered in two places:

- UI components: `src/config/node-component.ts`
- Runtime executors: `src/features/executions/lib/executor-registry.ts`

Current node catalog:

| Node | Type | Purpose |
| --- | --- | --- |
| Initial | `INITIAL` | Default starter node created with a workflow |
| Manual Trigger | `MANUAL_TRIGGER` | Starts a workflow from the editor execute button |
| Google Form Trigger | `GOOGLE_FORM_TRIGGER` | Starts a workflow from the Google Form webhook route |
| Stripe Trigger | `STRIPE_TRIGGER` | Starts a workflow from the Stripe webhook route |
| HTTP Request | `HTTP_REQUEST` | Makes outbound HTTP requests |
| Gemini | `GEMINI` | Generates text with Google Gemini |
| OpenAI | `OPENAI` | Generates text with OpenAI |
| Anthropic | `ANTHROPIC` | Generates text with Anthropic Claude |
| Discord | `DISCORD` | Sends messages to Discord |
| Slack | `SLACK` | Sends messages to Slack |

## Database Schema

The Prisma schema uses PostgreSQL and generates the Prisma client into `src/generated/prisma`.

Main models:

- `User`: application user managed by Better Auth.
- `Session`: active user sessions.
- `Account`: OAuth and password account records.
- `Verification`: Better Auth verification tokens.
- `Credential`: encrypted provider credentials owned by users.
- `workflow`: user-owned workflow container.
- `Node`: workflow node with type, position, JSON data, and optional credential.
- `Connection`: directed edge between two nodes.
- `Execution`: workflow run record with status, timestamps, output, and error details.

Main enums:

- `CredentialType`: `OPENAI`, `ANTHROPIC`, `GEMINI`
- `NodeType`: `INITIAL`, `MANUAL_TRIGGER`, `HTTP_REQUEST`, `GOOGLE_FORM_TRIGGER`, `STRIPE_TRIGGER`, `ANTHROPIC`, `GEMINI`, `OPENAI`, `DISCORD`, `SLACK`
- `ExecutionStatus`: `RUNNING`, `SUCCESS`, `FAILED`

## Routes and Pages

### Auth

| Route | Purpose |
| --- | --- |
| `/sign-in` | Sign in with Better Auth |
| `/sign-up` | Create a new account |

### Dashboard

| Route | Purpose |
| --- | --- |
| `/` | Redirects to `/workflows` |
| `/workflows` | List, search, paginate, create, and delete workflows |
| `/workflows/[workflowId]` | Visual workflow editor |
| `/credentials` | List, search, paginate, create, edit, and delete credentials |
| `/credentials/new` | Create a credential |
| `/credentials/[credentialId]` | Edit a credential |
| `/executions` | View workflow execution history |
| `/executions/[executionId]` | View one execution result |

### Example Sentry Routes

| Route | Purpose |
| --- | --- |
| `/sentry-example-page` | Sentry example page |
| `/api/sentry-example-api` | Sentry example API route |

## API and Webhooks

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/auth/[...all]` | Any | Better Auth route handler |
| `/api/trpc/[trpc]` | Any | tRPC API endpoint |
| `/api/inngest` | GET, POST, PUT | Inngest function endpoint |
| `/api/webhooks/google-form?workflowId=...` | POST | Triggers a workflow with Google Form payload data |
| `/api/webhooks/stripe?workflowId=...` | POST | Triggers a workflow with Stripe event payload data |

## tRPC Routers

The app exposes three main tRPC routers from `src/trpc/routers/_app.ts`.

### Workflows

- `workflows.create`: creates a workflow with an initial node. Requires an active Polar subscription.
- `workflows.getMany`: paginated and searchable workflow list for the current user.
- `workflows.getOne`: returns workflow nodes and connections transformed for React Flow.
- `workflows.update`: replaces saved nodes and connections for a workflow.
- `workflows.updateName`: renames a workflow.
- `workflows.remove`: deletes a workflow.
- `workflows.execute`: sends a workflow execution event to Inngest.

### Credentials

- `credentials.create`: creates an encrypted AI credential. Requires an active Polar subscription.
- `credentials.getMany`: paginated and searchable credential list.
- `credentials.getOne`: returns one credential for the current user.
- `credentials.getByType`: returns credentials matching a provider type.
- `credentials.update`: updates and re-encrypts a credential value.
- `credentials.remove`: deletes a credential.

### Executions

- `executions.getMany`: paginated execution history for the current user.
- `executions.getOne`: single execution with workflow metadata.

## Environment Variables

Create a `.env` file in the project root. Values below are names only; fill them with your own development or production credentials.

```env
# Database
DATABASE_URL=

# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# OAuth providers
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# App and webhook URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NGROK_URL=

# Credential encryption
ENCRYPTION_KEY=

# Polar billing
POLAR_ACCESS_TOKEN=
POLAR_SUCCESS_URL=http://localhost:3000/workflows

# Optional provider-level keys, if you use direct environment access in executors
GOOGLE_GENERATIVE_AI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Sentry
SENTRY_AUTH_TOKEN=
```

Important notes:

- `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` are required at app startup by `src/inngest/client.ts`.
- `ENCRYPTION_KEY` is required for credential encryption/decryption through Cryptr.
- `POLAR_ACCESS_TOKEN` is required because `premiumProcedure` checks subscription state through Polar.
- `NEXT_PUBLIC_APP_URL` is used when displaying webhook URLs in trigger dialogs.
- The current Polar client is configured for `sandbox` mode in `src/lib/polar.ts`.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yuvidew/nodebase.git
cd nodebase
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env` in the project root and fill in the variables from the [Environment Variables](#environment-variables) section.

### 4. Run database migrations

```bash
npm run migrate:dev
```

### 5. Start the Next.js app

```bash
npm run dev
```

Open http://localhost:3000.

### 6. Start Inngest locally

In a second terminal:

```bash
npm run inngest:dev
```

### 7. Run Next.js and Inngest together

The repository includes `mprocs.yaml`, so you can run both local processes with:

```bash
npm run dev:all
```

### 8. Test webhook triggers locally

For external services like Google Forms and Stripe to call your local app, expose port 3000:

```bash
npm run ngrok:dev
```

Then use webhook URLs like:

```text
https://your-public-url/api/webhooks/google-form?workflowId=WORKFLOW_ID
https://your-public-url/api/webhooks/stripe?workflowId=WORKFLOW_ID
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js with Turbopack |
| `npm run build` | Build the app with Turbopack |
| `npm run start` | Start the production Next.js server |
| `npm run lint` | Run ESLint |
| `npm run inngest:dev` | Start the Inngest local development server |
| `npm run prisma:dev` | Open Prisma Studio |
| `npm run migrate:dev` | Run Prisma migrations in development |
| `npm run ngrok:dev` | Expose local port 3000 through the configured ngrok URL |
| `npm run dev:all` | Run Next.js and Inngest together through mprocs |

## Development Notes

- Workflow creation and credential creation are guarded by `premiumProcedure`, so local testing may require a valid Polar sandbox customer subscription.
- `next.config.ts` currently sets `typescript.ignoreBuildErrors` to `true`. Type-checking should still be run manually during development if you need strict confidence.
- Generated Prisma files live in `src/generated/prisma` and are ignored by ESLint rules.
- The editor saves the full set of nodes and edges by deleting existing workflow nodes/connections and recreating them in a Prisma transaction.
- The execution engine uses topological sorting. Cyclic workflows throw `Workflow contains a cycle`.
- Execution retries are `0` in development and `3` in production.
- The Sentry Next.js plugin is enabled with a tunnel route at `/monitoring`.

## Adding a New Node

To add a new workflow node type:

1. Add the new value to the Prisma `NodeType` enum.
2. Create a node UI component under `src/features/executions/_components` or `src/features/triggers/_components`.
3. Create an executor that implements `NodeExecutor`.
4. Register the UI component in `src/config/node-component.ts`.
5. Register the executor in `src/features/executions/lib/executor-registry.ts`.
6. Add the option to `src/components/node-selector.tsx`.
7. Create or update any Inngest realtime channel if the node should publish runtime events.
8. Run a Prisma migration if the database schema changed.

## License

This project currently does not include a license file. Add a `LICENSE` file before publishing clear reuse terms.
