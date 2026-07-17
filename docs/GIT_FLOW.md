# Git Flow — Cosmic Explorer

> Panduan profesional untuk version control menggunakan Git Flow dengan develop branch strategy.

---

## 1. Overview

Git Flow adalah branching model yang terstruktur untuk project dengan release cycle yang jelas. Documentation ini mendeskripsikan workflow yang digunakan untuk Cosmic Explorer project.

### Menggunakan Git Flow

- **Branching strategy:** Develop-based workflow
- **Commit convention:** Conventional Commits
- **Merge strategy:** Squash merge untuk features, merge commit untuk releases
- **Versioning:** Semantic Versioning (MAJOR.MINOR.PATCH)
- **CI/CD:** GitHub Actions untuk automated testing dan deployment

### Prerequisites

- Git 2.x atau lebih baru
- GitHub account
- Node.js 18+
- npm atau yarn

---

## 2. Branch Strategy

### Main Branches (Permanent)

| Branch    | Kegunaan                                | Protected |
| --------- | --------------------------------------- | --------- |
| `main`    | Production-ready code, releases         | Yes       |
| `develop` | Integration branch untuk semua features | Yes       |

### Supporting Branches (Temporary)

| Branch  | Pattern     | Lifetime    | Merge To       |
| ------- | ----------- | ----------- | -------------- |
| Feature | `feature/*` | Short-lived | develop        |
| Release | `release/*` | Medium      | main + develop |
| Hotfix  | `hotfix/*`  | Very short  | main + develop |

### Visual Flow

```
main ─────●─────────●─────────●─────────●─────────●───→
          ↑         ↑         ↑         ↑         ↑
          │         │         │         │         │
          │     merge     merge     merge     merge
          │         ↑         ↑         ↑         ↑
develop ──●─────────●─────────●─────────●─────────●───→
          ↑         ↑         ↑         ↑
          │         │         │         │
feature ──●─────●   │         │         │
  /solar      ↑    │         │         │
              │    │         │         │
feature ──────●────●─────●   │         │
  /quiz           ↑    ↑    │         │
                  │    │    │         │
feature ──────────●────●────●         │
  /auth                ↑             │
                       │             │
release ───────────────●─────────────│
  /v1.0.0                           ↑
                                    │
hotfix ─────────────────────────────●
  /critical-bug
```

---

## 3. Branch Types and Naming

### Naming Convention

| Type          | Format                             | Example                   |
| ------------- | ---------------------------------- | ------------------------- |
| Feature       | `feature/[short-description]`      | `feature/solar-system-3d` |
| Bug Fix       | `fix/[short-description]`          | `fix/texture-loading`     |
| Release       | `release/v[major].[minor].[patch]` | `release/v1.0.0`          |
| Hotfix        | `hotfix/[short-description]`       | `hotfix/critical-bug`     |
| Documentation | `docs/[short-description]`         | `docs/api-reference`      |
| Refactor      | `refactor/[short-description]`     | `refactor/cleanup-hooks`  |
| Chore         | `chore/[short-description]`        | `chore/update-deps`       |
| CI/CD         | `ci/[short-description]`           | `ci/add-github-actions`   |

### Branch Rules

**Feature Branch:**

- Dibuat dari `develop`
- Singkat hidupnya (idealnya < 1 minggu)
- Satu fitur per branch
- Naming deskriptif

**Release Branch:**

- Dibuat dari `develop` saat mencapai versi stabil
- Hanya bug fixes dan documentation updates
- Tidak ada fitur baru
- Merge ke `main` dan `develop`

**Hotfix Branch:**

- Dibuat dari `main` untuk critical bug
- Fix segera di-merge ke `main`
- Juga di-merge ke `develop` untuk mencegah bug muncul lagi

---

## 4. Commit Convention

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type       | Description                              | Contoh                               |
| ---------- | ---------------------------------------- | ------------------------------------ |
| `feat`     | New feature                              | `feat(3d): add planet component`     |
| `fix`      | Bug fix                                  | `fix(ui): correct panel positioning` |
| `docs`     | Documentation changes                    | `docs(readme): update setup`         |
| `style`    | Code style (formatting, semicolons, etc) | `style: format with prettier`        |
| `refactor` | Code refactoring (no functional changes) | `refactor(hooks): simplify logic`    |
| `perf`     | Performance improvement                  | `perf(3d): optimize texture loading` |
| `test`     | Adding/updating tests                    | `test(planet): add unit tests`       |
| `chore`    | Maintenance (dependencies, build, etc)   | `chore(deps): update Next.js`        |
| `ci`       | CI/CD changes                            | `ci: add GitHub Actions`             |

### Scopes

| Scope    | Kegunaan                   |
| -------- | -------------------------- |
| `core`   | Core functionality         |
| `3d`     | 3D rendering, R3F, shaders |
| `ui`     | UI components, styling     |
| `auth`   | Authentication, Supabase   |
| `quiz`   | Quiz system                |
| `api`    | API routes                 |
| `deps`   | Dependencies               |
| `config` | Configuration files        |
| `layout` | Layout components          |

### Examples

```
feat(3d): add planet component with PBR materials

- Implement Planet.tsx with diffuse, normal, specular textures
- Add orbit animation using Kepler equations
- Support click and hover interactions

Closes #42
```

```
fix(ui): correct info panel positioning on mobile

Panel was overflowing viewport on screens < 768px.
Added responsive breakpoints and adjusted margins.

Refs: #38
```

```
docs(readme): update setup instructions

Added texture download steps and environment setup guide.
```

```
chore(deps): update Next.js to 14.2.35
```

```
refactor(3d): simplify usePlanetPosition hook

Extracted orbital calculation into separate utility function.
No functional changes.
```

---

## 5. Workflow Process

### Starting a Feature

1. **Update develop branch**

   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Create feature branch**

   ```bash
   git checkout -b feature/solar-system
   ```

3. **Develop and commit**

   ```bash
   # Make changes
   git add .
   git commit -m "feat(3d): add solar system scene"

   # More changes
   git add .
   git commit -m "feat(3d): add planet components"
   ```

4. **Push to remote**

   ```bash
   git push -u origin feature/solar-system
   ```

5. **Create PR and merge**
   - Create PR from `feature/solar-system` to `develop`
   - Review code
   - Squash and merge

### Feature Development Tips

- Commit kecil dan sering (atomic commits)
- Gunakan commit message yang jelas
- Update branch dengan develop secara berkala
- Test sebelum push
- Gunakan PR untuk code review

---

## 6. Merge Strategy

### Feature to Develop (Squash Merge)

Squash merge menggabungkan semua commits dari feature branch menjadi satu commit di develop. Ini menjaga history develop tetap clean.

```bash
# Update develop
git checkout develop
git pull origin develop

# Squash merge feature
git merge --squash feature/solar-system

# Commit dengan message deskriptif
git commit -m "feat: Solar System 3D visualization"

# Push
git push origin develop
```

### Develop to Main (Merge Commit)

Merge commit mempertahankan history dari develop branch dan menambahkan merge commit sebagai titik rilis.

```bash
# Update main
git checkout main
git pull origin main

# Merge develop
git merge --no-ff develop

# Tag release
git tag -a v1.0.0 -m "Release v1.0.0"

# Push
git push origin main --tags
```

### Why This Strategy

- **Squash merge untuk features:** Menjaga history develop tetap linear dan mudah dibaca. Setiap fitur menjadi satu commit di develop.
- **Merge commit untuk releases:** Mempertahankan history develop dan memberikan titik rilis yang jelas di main.

---

## 7. Release Process

### Pre-Release Checklist

- [ ] Semua features selesai dan tested
- [ ] Build successful
- [ ] Type check passed
- [ ] Lint passed
- [ ] Documentation updated
- [ ] CHANGELOG updated

### Step-by-Step Release

1. **Create release branch dari develop**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.0.0
   ```

2. **Final testing dan bug fixes**

   ```bash
   # Jika ada bug fixes
   git commit -m "fix: resolve texture loading issue"
   ```

3. **Update version di package.json**

   ```bash
   npm version 1.0.0 --no-git-tag-version
   git add package.json
   git commit -m "chore(release): v1.0.0"
   ```

4. **Generate CHANGELOG**

   ```bash
   npx conventional-changelog -p angular -i CHANGELOG.md -s
   git add CHANGELOG.md
   git commit -m "docs: update CHANGELOG"
   ```

5. **Merge ke main**

   ```bash
   git checkout main
   git merge --no-ff release/v1.0.0
   git tag -a v1.0.0 -m "Release v1.0.0"
   ```

6. **Merge back ke develop**

   ```bash
   git checkout develop
   git merge --no-ff release/v1.0.0
   ```

7. **Push**

   ```bash
   git push origin main --tags
   git push origin develop
   ```

8. **Cleanup**

   ```bash
   git branch -d release/v1.0.0
   git push origin --delete release/v1.0.0
   ```

9. **Deploy**
   - Vercel auto-deploy dari main branch
   - Atau trigger manual deployment

---

## 8. Hotfix Process

Hotfix digunakan untuk memperbaiki critical bug di production.

1. **Create hotfix branch dari main**

   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-bug
   ```

2. **Fix bug**

   ```bash
   # Make changes
   git commit -m "fix: resolve critical authentication bug"
   ```

3. **Update patch version**

   ```bash
   npm version 1.0.1 --no-git-tag-version
   git add package.json
   git commit -m "chore(release): v1.0.1"
   ```

4. **Merge ke main**

   ```bash
   git checkout main
   git merge --no-ff hotfix/critical-bug
   git tag -a v1.0.1 -m "Hotfix v1.0.1"
   ```

5. **Merge ke develop**

   ```bash
   git checkout develop
   git merge --no-ff hotfix/critical-bug
   ```

6. **Push**

   ```bash
   git push origin main --tags
   git push origin develop
   ```

7. **Cleanup**
   ```bash
   git branch -d hotfix/critical-bug
   git push origin --delete hotfix/critical-bug
   ```

---

## 9. Git Aliases

### Setup Aliases

```bash
# Basic aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status

# Log aliases
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.last "log -1 HEAD"
git config --global alias.visual "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# Undo aliases
git config --global alias.undo "reset --soft HEAD~1"
git config --global alias.unstage "reset HEAD --"

# Amend alias
git config --global alias.amend "commit --amend --no-edit"

# Quick aliases
git config --global alias.wip "commit -am 'WIP'"
git config --global alias.sync "pull --rebase origin develop"

# Branch aliases
git config --global alias.feature "checkout -b feature/"
git config --global alias.release "checkout -b release/"
git config --global alias.hotfix "checkout -b hotfix/"
```

### Usage Examples

```bash
# Create feature branch
git feature solar-system
# Equivalent to: git checkout -b feature/solar-system

# Quick commit work in progress
git wip

# Undo last commit (keep changes)
git undo

# View beautiful log
git lg

# View last commit
git last

# Amend last commit message
git commit -m "fix: correct typo"
git amend
```

---

## 10. Git Hooks

### Pre-commit Hook

Menjalankan lint-staged sebelum commit untuk memastikan kode ter-format dengan benar.

**.husky/pre-commit:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "Running pre-commit checks..."
npm run lint-staged
echo "Pre-commit checks passed!"
```

### Commit-msg Hook

Memvalidasi format commit message menggunakan commitlint.

**.husky/commit-msg:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

### Pre-push Hook

Menjalankan build validation sebelum push ke remote.

**.husky/pre-push:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "Running pre-push checks..."
npm run build
echo "Pre-push checks passed!"
```

### Commitlint Configuration

**commitlint.config.js:**

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore",
        "ci",
      ],
    ],
    "scope-enum": [
      2,
      "always",
      ["core", "3d", "ui", "auth", "quiz", "api", "deps", "config", "layout"],
    ],
    "subject-case": [2, "never", ["sentence-case"]],
    "subject-empty": [2, "never"],
    "subject-max-length": [2, "always", 100],
    "body-max-line-length": [2, "always", 200],
  },
};
```

---

## 11. GitHub Settings

### Branch Protection Rules

**Main Branch:**

- Require pull request reviews before merging
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Require linear history (optional)
- Include administrators (optional)

**Develop Branch:**

- Require pull request reviews before merging
- Require status checks to pass before merging

### Default Merge Options

- Allow squash merging (default)
- Allow merge commits
- Allow rebase merging
- Automatically delete head branches

### Collaborators and Teams

- Solo developer: Direct push ke develop, PR ke main
- Team: PR ke both develop dan main

---

## 12. Pull Request Template

**.github/pull_request_template.md:**

```markdown
## Description

[Describe what this PR does in 2-3 sentences]

## Type of Change

- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix/feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring (no functional changes)

## Related Issues

Closes #[issue_number]

## Testing

- [ ] Local testing passed
- [ ] Unit tests added/updated
- [ ] Integration tests passed
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-reviewed code
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings introduced
- [ ] Build passes (`npm run build`)
- [ ] Type check passes (`npm run type-check`)
- [ ] Lint passes (`npm run lint`)
- [ ] No console.log statements left
- [ ] Responsive design tested
- [ ] Accessibility checked

## Screenshots (if applicable)

[Add screenshots showing UI changes]

## Additional Notes

[Any additional information for reviewers]
```

---

## 13. Changelog Generation

### Install

```bash
npm install -D conventional-changelog-cli standard-version
```

### Generate Changelog

```bash
npx conventional-changelog -p angular -i CHANGELOG.md -s
```

### Add to package.json

```json
{
  "scripts": {
    "release": "standard-version",
    "release:minor": "standard-version --release-as minor",
    "release:major": "standard-version --release-as major",
    "release:patch": "standard-version --release-as patch",
    "release:alpha": "standard-version --prerelease alpha",
    "release:beta": "standard-version --prerelease beta",
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s"
  }
}
```

### Changelog Format

```markdown
# Changelog

## [1.0.0] - 2026-07-01

### Features

- **3d:** add solar system visualization (abc1234)
- **ui:** add planet info panel (def5678)

### Bug Fixes

- **ui:** correct responsive layout on mobile (ghi9012)
- **3d:** fix texture loading issue (jkl3456)

### Documentation

- **readme:** update setup instructions (mno7890)

### Chores

- **deps:** update Next.js to 14.2.35 (pqr1234)
```

---

## 14. Semantic Versioning

### Format

```
MAJOR.MINOR.PATCH
```

### Rules

| Change                             | Version    | Example                     |
| ---------------------------------- | ---------- | --------------------------- |
| Breaking changes                   | Major      | 1.0.0 -> 2.0.0              |
| New features (backward compatible) | Minor      | 1.0.0 -> 1.1.0              |
| Bug fixes (backward compatible)    | Patch      | 1.0.0 -> 1.0.1              |
| Pre-release                        | Prerelease | 1.0.0-alpha.1, 1.0.0-beta.1 |

### Pre-release Stages

| Stage                  | Description                 |
| ---------------------- | --------------------------- |
| Alpha                  | Early development, unstable |
| Beta                   | Feature complete, testing   |
| RC (Release Candidate) | Final testing before stable |
| Stable                 | Production ready            |

### Cosmic Explorer Milestones

| Phase     | Version     | Description                  |
| --------- | ----------- | ---------------------------- |
| Phase 1-2 | 0.1.0-alpha | Solar System + Interactivity |
| Phase 3-4 | 0.2.0-alpha | Stellar + Exoplanet          |
| Phase 5-6 | 0.3.0-alpha | Galaxy + Cosmic              |
| Phase 7   | 0.4.0-beta  | Supabase Integration         |
| Phase 8-9 | 0.5.0-beta  | Quiz + i18n + Audio          |
| Phase 10  | 1.0.0-rc    | Polish                       |
| Final     | 1.0.0       | Production Release           |

---

## 15. Best Practices

### Commit Rules

**DO:**

- Commit early, commit often
- Write meaningful commit messages
- Use conventional commits format
- Keep commits atomic (one change per commit)
- Reference issues in commits

**DON'T:**

- Commit broken code
- Use generic messages ("fix", "update", "changes")
- Commit generated files
- Commit secrets or credentials
- Force push to main/develop

### Branch Rules

**DO:**

- Keep feature branches short-lived
- Delete merged branches
- Update branches regularly
- Use descriptive branch names

**DON'T:**

- Work directly on main
- Commit to develop without PR
- Leave stale branches
- Mix features in one branch

### Code Review

**DO:**

- Review all PRs (even solo)
- Test before approving
- Provide constructive feedback
- Check for security issues

**DON'T:**

- Merge without review
- Skip CI/CD checks
- Ignore failing tests
- Rush approvals

### Security

**DO:**

- Use .gitignore properly
- Never commit secrets
- Use environment variables
- Review dependencies

**DON'T:**

- Hardcode credentials
- Commit .env files
- Expose API keys
- Use weak passwords

---

## 16. References

- [Git Flow Original](http://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Commitlint](https://commitlint.js.org/)
- [Standard Version](https://github.com/conventional-changelog/standard-version)

---

> **Maintainer:** Cosmic Explorer Team
> **Last Updated:** 2026-07-01
