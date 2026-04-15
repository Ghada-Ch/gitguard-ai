# 🛡️ GitGuard AI
> AI-powered Git security & risk scanner for modern developers.


![npm version](https://img.shields.io/npm/v/gitguard-ai)
![downloads](https://img.shields.io/npm/dm/gitguard-ai)
![license](https://img.shields.io/npm/l/gitguard-ai)


---

## ⚡ Overview

GitGuard AI analyzes your Git repository and detects:

- 🔐 Secrets (API keys, tokens, passwords)
- ⚠️ Merge conflicts
- 📦 Dependency risks
- 🚨 Deployment issues
- 🧠 Dangerous code patterns
- 📏 Large risky changes

---

## 🚀 Installation

### Global install
```bash
npm install -g gitguard-ai
```
### Or run instantly (recommended)
```bash
npx gitguard-ai
```

## 🧪 Usage

### Scan last commit (default)
```bash
gitguard-ai
```
### Full repository scan
```bash
gitguard-ai --full
```

## 📊 Example Output

```text
🔍 GitGuard AI running...

⚠️ GitGuard AI Report

Risk Score: 95

📄 README.md
⚠️ Merge conflict detected
💡 Unresolved Git conflict markers found in file(s).

📄 backend/Procfile
⚠️ Deployment config modified
💡 Changes may affect production startup.

📄 package.json
⚠️ Dependency changes detected
💡 New or updated dependencies may introduce risk.

❌ High risk detected. Failing CI.
```
## 🌍 Full Scan Mode

Analyze the entire repository:

- all tracked files (`git ls-files`)
- dependency footprint
- security patterns
- deployment configuration

```bash
gitguard-ai --full
```

## 🤖 GitHub Actions (CI Integration)

Run GitGuard AI automatically on every pull request:

```yaml
name: GitGuard AI

on:
  pull_request:

jobs:
  scan:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Run GitGuard AI
        run: npx gitguard-ai --full

```
## 🧠 How It Works

Git Repository
      ↓
Git Diff / File Scan
      ↓
Rule Engine
      ↓
Risk Scoring System
      ↓
CLI Output / CI Failure
## 📈 Risk Levels

| Score | Level | Meaning |
|------|------|--------|
| 0–39 | 🟢 Low | Safe changes |
| 40–69 | 🟡 Medium | Needs review |
| 70–100 | 🔴 High | Risky changes |

## 🔍 Detection Rules

GitGuard AI detects:

- 🔐 Secrets (API keys, tokens, passwords)
- ⚠️ Merge conflicts (`<<<<<<<`)
- 📦 Dependency changes (`package.json`)
- 🚨 Deployment changes (`Procfile`)
- 🧠 Dangerous JS functions (`eval`, `exec`)
- 📏 Large diff changes

## 📁 Workflow Example

```bash
git add .
git commit -m "new feature"
gitguard-ai
git push

```
## 🚀 Roadmap

- [ ] GitHub PR bot comments 🤖
- [ ] JSON output mode (`--json`)
- [ ] `.gitguardignore` support
- [ ] Severity grouping (HIGH / MEDIUM / LOW)
- [ ] AST-based deep analysis
- [ ] AI-powered fix suggestions

## 💡 Vision

> GitGuard AI becomes the ESLint of security & Git risk analysis.

Fast. Lightweight. Developer-first.

## 👤 Author

Built with passion for modern development workflows.

---

## 📄 License

MIT
