# Vishnave Technology – Frontend

This is the official frontend of Vishnave Technology Pvt. Ltd.

## 🛠️ Tech Stack

- React + Vite
- TypeScript
- Tailwind CSS
- ShadCN UI
- Bun (or npm)

## 📦 Development Setup

```bash
bun install
bun run dev

📋 Scripts
bun run format – Prettier formatting

bun run typecheck – TypeScript checks

bun run cspell – Spell checking

bun run knip – Detect unused code

🧪 CI/CD
All PRs are checked for formatting, spell issues, and unused code before merge.

yaml
Copy
Edit

---

## 🔹 Backend (`vishnave-backend`)

### `.gitignore`

```gitignore
# Node
node_modules/
dist/
bun.lockb

# Prisma
.prisma/
.env

# Editor
.vscode/
.idea/
.DS_Store