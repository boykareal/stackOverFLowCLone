# Stack Overflow Clone

A full-stack developer Q&A platform where developers can ask questions, share answers, vote on useful content, and build reputation.

**Live demo:** [stack-over-f-low-c-lone.vercel.app](https://stack-over-f-low-c-lone.vercel.app/login/)

## Highlights

- Secure email/password authentication with Appwrite sessions
- Create, update, and delete questions with Markdown content, tags, and image attachments
- Browse questions by newest, tag, or full-text search, with pagination
- Post and delete answers and comments
- Upvote or downvote questions and answers; authors' reputation updates with each vote
- Public user profiles with questions, answers, votes, and reputation
- Responsive UI built with Next.js App Router and Tailwind CSS

## Tech stack

| Area | Tools |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend services | Appwrite (Auth, Databases, Storage) |
| Client state | Zustand |
| UI | shadcn/ui, Tabler Icons, Motion |
| Deployment | Vercel |

## Getting started

### Prerequisites

- Node.js 20 or later
- An Appwrite project (Cloud or self-hosted)

### Installation

1. Clone the repository and install dependencies.

   ```bash
   git clone <your-repository-url>
   cd stackoverflow-appwrite
   npm install
   ```

2. Copy the environment template and add your Appwrite credentials.

   ```bash
   cp .env.example .env.local
   ```

3. Start the development server.

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APPWRITE_HOST_URL` | Appwrite API endpoint, for example `https://<region>.cloud.appwrite.io/v1` |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Appwrite project ID |
| `APPWRITE_API_KEY` | Server-only Appwrite API key used for database and storage setup |

Never expose `APPWRITE_API_KEY` in a client-side variable or commit `.env.local`.

## Appwrite setup

1. Create an Appwrite project and add a Web platform for `localhost` during local development. Add your Vercel domain before deploying.
2. Create an API key with the database, users, and storage permissions required by the app, then set it as `APPWRITE_API_KEY`.
3. Add the three environment variables above. On the first non-API request, the app initializes its database, collections, indexes, and attachment bucket.
4. Enable Email/Password authentication in your Appwrite project.

The schema uses the following Appwrite resources:

- Database: `main-stackoverflow`
- Collections: `questions`, `answers`, `comments`, and `Votes`
- Storage bucket: `question-attachement`

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run lint` | Check the codebase with ESLint |
| `npm run build` | Create a production build |
| `npm run start` | Serve a production build |

## Project structure

```text
src/
├── app/                 # Routes, API handlers, layouts, and pages
├── components/          # Reusable question, answer, vote, and UI components
├── models/              # Appwrite clients, schema setup, and domain types
├── store/               # Auth state
└── utils/               # Formatting and slug helpers
```

## Deployment

The app is deployed on Vercel. Set the same three environment variables in your Vercel project settings, add the deployed domain as an Appwrite Web platform, and deploy.

## Interview walkthrough

When reviewing this project, start with:

1. `src/app/questions/page.tsx` for server-rendered question discovery, filtering, and pagination.
2. `src/components/QuestionForm.tsx` for question creation, uploads, and edits.
3. `src/app/api/vote/route.ts` for server-side vote handling and reputation changes.
4. `src/models/server/` for Appwrite schema initialization and server-only configuration.
