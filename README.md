# Aspire Project

## Prerequisites

- **Node.js v20.9+** (required for Prisma and vite)
- **npm** (comes with Node.js)
- **PostgreSQL** (for the server database)

## Project Structure

- `client/` – Frontend React app (Vite + TypeScript)
- `server/` – Backend Node.js API (TypeScript, Prisma, PostgreSQL)

---

## 1. Clone the Repository

```sh
git clone https://github.com/dylancarlone/aspire.git
cd aspire
```

---

## 2. Environment Variables

### Server

- Copy `.env.example` or create `.env` in `server/` with your database and github credentials:
  ```
  cd server
  cp .env.example .env
  # Edit .env to set DATABASE_URL and GITHUB_TOKEN
  ```

---

## 3. Install Dependencies

### Server

```sh
cd server
npm install
```

### Client

```sh
cd ../client
npm install
```

---

## 4. Set Up the Database

- Ensure PostgreSQL is running.
- Create a database (e.g., `aspire`).

Update `DATABASE_URL` in `server/.env` to point to your database.

e.g. `DATABASE_URL="postgresql://user@localhost:5432/aspire?schema=public"`

---

## 5. Prisma Setup

### Generate Prisma Client

```sh
cd server
npx prisma generate
```

### Run Migrations

```sh
npx prisma migrate deploy
# or for development:
npx prisma migrate dev
```

---

## 6. Running the Apps

### Server

```sh
cd server
npm run dev
```

### Client

```sh
cd client
npm run dev
```

- The client will typically run on [http://localhost:5173](http://localhost:5173)
- The server will typically run on [http://localhost:4000](http://localhost:4000) (check your config)

---

## 7. Cron Job Setup

The project contains the script `src/scripts/update-repository-latest-releases.ts` to fetch latest releases from GitHub. In production could be used by a job/queue system (e.g. BullMQ) to run asynchronously and periodically.

To refresh latest releases every 5 minutes, add this to your crontab:

```sh
*/5 * * * * cd /absolute/path/to/project/server && npm run update-repository-latest-releases' >> ./cron.log 2>&1
```

Note: This can be tricky depending on the node environment is set up locally, so it may be neccesary to use the full path to npm or further configure the cron environment:

```sh
*/5 * * * * cd /Users/dylancarlone/dev/aspire/server && /Users/dylancarlone/.nvm/versions/node/20.9.0/bin/npm run update-repository-latest-releases >> ./cron.log 2>&1
```

- Use `which npm` to ensure the correct npm path if needed.

---

## 8. Implementation Notes & Trade-offs

- The backend uses a minimal TypeScript setup for rapid development; some type safety and structure could be improved for production. I also made some quick decisions in the tsconfig file to get TypeScript up and running quickly with expected file imports
- Prisma is used for database access and migrations for simplicity and type safety, though totally overkill for this example - knex would suffice for the limited database access in this project so far
- The cron job is implemented as a simple script for ease of demonstration, but a more robust job/queue system is recommended for production (e.g. BullMQ or another queue sytem)
- Error handling and validation are basic and could certainly be expanded for a production environment, using Formik to handle form state
- Authentication is limited to GitHub token usage for API access; no user authentication is implemented yet, but could implement GitHub OAuth login

---

## 9. Suggestions for Future Improvements

- Add comprehensive error handling and input validation on both client and server (e.g. Yup / better Apollo validation handling/messaging)
- Implement user authentication and authorization.
- Add unit/integration tests where it makes sense, probably on API code first
- Refactor server code for better modularity and callability outside of GraphQL flow

---

## 10. Additional Notes

- TypeScript setup in the server is minimal for quick start; consider refining exports and structure for production.
- Logs from the cron job are written to `server/cron.log`.

---

## 11. Troubleshooting

- If you encounter issues with Prisma, try `npx prisma generate` and `npx prisma migrate dev` again.
- Ensure your environment variables are set correctly.
- Check that PostgreSQL is running and accessible.
