# Interactive Cosmic Explorer — Documentation

> Complete documentation for developers, contributors, and maintainers.

---

## Quick Start

1. **Setup:** [SETUP.md](SETUP.md) — Environment setup and installation
2. **Development:** [DEVELOPMENT.md](DEVELOPMENT.md) — Development workflow and best practices
3. **Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md) — System design and patterns
4. **Folder Structure:** [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) — Code organization

---

## Core Documentation

| Document                                   | Description                                            |
| ------------------------------------------ | ------------------------------------------------------ |
| [PROJECT.md](PROJECT.md)                   | Project overview, goals, timeline, tech stack          |
| [ARCHITECTURE.md](ARCHITECTURE.md)         | System architecture, state management, database schema |
| [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) | Detailed folder organization and naming conventions    |
| [DEVELOPMENT.md](DEVELOPMENT.md)           | Developer guide, git workflow, testing, debugging      |
| [SETUP.md](SETUP.md)                       | Complete environment setup instructions                |
| [DEPLOYMENT.md](DEPLOYMENT.md)             | Deploy to Vercel + Railway, monitoring, scaling        |

---

## Technical Guides

### 3D & Rendering

- [guides/SCALE_SYSTEM.md](guides/SCALE_SYSTEM.md) — Multi-scale navigation system
- [guides/3D_RENDERING.md](guides/3D_RENDERING.md) — React Three Fiber patterns (TODO)
- [guides/SHADER_GUIDE.md](guides/SHADER_GUIDE.md) — Custom GLSL shaders (TODO)

### Data & Backend

- [guides/DATA_MODELS.md](guides/DATA_MODELS.md) — TypeScript types and schemas (TODO)
- [guides/SUPABASE_SETUP.md](guides/SUPABASE_SETUP.md) — Database setup and RLS policies (TODO)

### Features

- [guides/QUIZ_SYSTEM.md](guides/QUIZ_SYSTEM.md) — Quiz implementation (TODO)
- [guides/I18N_SETUP.md](guides/I18N_SETUP.md) — Multi-language setup (TODO)
- [guides/AUDIO_SYSTEM.md](guides/AUDIO_SYSTEM.md) — Audio management (TODO)

---

## Phase Implementation Guides

Step-by-step guides for each development phase:

| Phase | Guide                                                | Focus                                  |
| ----- | ---------------------------------------------------- | -------------------------------------- |
| 1-2   | [phase-guides/PHASE_1.md](phase-guides/PHASE_1.md)   | Project setup + Solar System 3D (TODO) |
| 3-4   | [phase-guides/PHASE_2.md](phase-guides/PHASE_2.md)   | Interactivity + Detail pages (TODO)    |
| 5-6   | [phase-guides/PHASE_3.md](phase-guides/PHASE_3.md)   | Stellar + Constellations (TODO)        |
| 7-8   | [phase-guides/PHASE_4.md](phase-guides/PHASE_4.md)   | Exoplanet + Nebula (TODO)              |
| 9-10  | [phase-guides/PHASE_5.md](phase-guides/PHASE_5.md)   | Galaxy + Black Holes (TODO)            |
| 11-12 | [phase-guides/PHASE_6.md](phase-guides/PHASE_6.md)   | Cosmic Web + Dark Matter (TODO)        |
| 13-14 | [phase-guides/PHASE_7.md](phase-guides/PHASE_7.md)   | Supabase Integration (TODO)            |
| 15-16 | [phase-guides/PHASE_8.md](phase-guides/PHASE_8.md)   | Quiz System (TODO)                     |
| 17-18 | [phase-guides/PHASE_9.md](phase-guides/PHASE_9.md)   | i18n + Audio (TODO)                    |
| 19-20 | [phase-guides/PHASE_10.md](phase-guides/PHASE_10.md) | Polish + Deploy (TODO)                 |

---

## Implementation Plans

Detailed task-by-task implementation plans (created via `writing-plans` skill):

```
superpowers/plans/
├── YYYY-MM-DD-phase-1-project-setup.md       (TODO)
├── YYYY-MM-DD-phase-2-solar-system.md         (TODO)
├── YYYY-MM-DD-phase-3-interactivity.md        (TODO)
└── ... (created as needed during development)
```

---

## Documentation Status

| Category                 | Status          |
| ------------------------ | --------------- |
| **Core Docs**            | ✅ Complete     |
| **Technical Guides**     | 🚧 1/6 complete |
| **Phase Guides**         | 📝 Not started  |
| **Implementation Plans** | 📝 Not started  |

Legend:

- ✅ Complete
- 🚧 In progress
- 📝 Not started
- ⚠️ Needs update

---

## Contributing to Docs

### Documentation Style Guide

1. **Use Markdown** — All docs in `.md` format
2. **Headers** — Use `#` for title, `##` for sections, `###` for subsections
3. **Code blocks** — Always specify language: \`\`\`typescript, \`\`\`bash, \`\`\`json
4. **Links** — Use relative paths: `[SETUP.md](SETUP.md)`
5. **Tables** — Use for structured data
6. **Keep it concise** — Clear, direct, actionable

### Adding New Documentation

1. Create file in appropriate folder:
   - Core docs → `docs/`
   - Technical guides → `docs/guides/`
   - Phase guides → `docs/phase-guides/`
   - Implementation plans → `docs/superpowers/plans/`

2. Follow naming convention:
   - `UPPERCASE_WITH_UNDERSCORES.md` for core docs
   - `PascalCase.md` for guides
   - `YYYY-MM-DD-kebab-case.md` for implementation plans

3. Update this README with link to new doc

4. Add front matter (optional):
   ```markdown
   ---
   title: Document Title
   description: Brief description
   author: Your Name
   date: 2026-01-01
   status: draft | in-progress | complete
   ---
   ```

### Updating Documentation

1. Check for outdated information
2. Update code examples to match current codebase
3. Verify all links work
4. Update status in this README
5. Commit with message: `docs: update [filename]`

---

## Documentation Maintenance

### Regular Tasks

| Task                        | Frequency         | Owner      |
| --------------------------- | ----------------- | ---------- |
| Review and update core docs | Monthly           | Maintainer |
| Update code examples        | Per major version | Developer  |
| Add new guides              | As needed         | Developer  |
| Fix broken links            | Weekly            | Maintainer |
| Update phase guides         | During phase      | Developer  |

### Issue Reporting

Found an error or outdated info?

1. Check if issue already exists
2. Create new issue with label `documentation`
3. Include:
   - File name
   - Section
   - What's wrong
   - Suggested fix

---

## Tools

### Markdown Preview

**VS Code:**

- `Ctrl+Shift+V` — Preview markdown
- `Ctrl+K V` — Preview side-by-side

**Online:**

- https://dillinger.io — Live markdown editor

### Link Checker

```bash
# Check for broken links
npm run check-docs-links
```

### Auto-generate Table of Contents

```bash
# Install doctoc
npm install -g doctoc

# Generate TOC for file
doctoc docs/ARCHITECTURE.md
```

---

## Getting Help

- **Questions:** Open a discussion on GitHub
- **Issues:** Report bugs/typos via GitHub Issues
- **Suggestions:** Open a discussion or PR

---

## License

Documentation is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Code examples in documentation follow the same license as the main project.
