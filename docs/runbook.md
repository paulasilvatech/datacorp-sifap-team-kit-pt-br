# Team Runbook Template

![Runbook Type](https://img.shields.io/badge/Type-Runbook-171717?style=flat-square)
![Owner DevOps](https://img.shields.io/badge/Owner-DevOps-737373?style=flat-square)

> **Path:** [Team Kit](../README.md) › [Docs](README.md) › **Runbook**

**Template for documenting how to run, verify and diagnose the participants' own solution.**
Fill it in with the team's commands and evidence; it does not describe or grant access to instructor environments.

| Field | Value |
|---|---|
| **Target audience** | DevOps Engineer and the entire team |
| **Prerequisites** | Local setup completed according to [`00-SETUP.md`](../00-SETUP.md) |
| **Expected outcome** | Working local environment, readable CI, and correct escalation |

---

## Initial checks (first use)

- [ ] **Verify prerequisites** — run each line and confirm that no errors occur:

```bash
git --version
java -version
node --version
docker --version
specify version
```

> [!NOTE]
> The kit does not include a ready-made prototype. When the team creates `backend/`, `frontend/`, and, if needed, `infra/`, record the actual execution commands here.

After creating the prototype, document:

| Service | URL / Command |
|---|---|
| Backend health | — |
| Swagger UI | — |
| Local frontend | — |
| How to configure local authentication, without recording passwords | — |

---

## Daily routine

- [ ] **Check repository state:**

```bash
git status
```

- [ ] **Run backend tests** (when `backend/` exists):

```bash
cd backend && ./mvnw test
```

- [ ] **Run frontend tests** (when `frontend/` exists):

```bash
cd frontend && pnpm test
```

---

## CI — Understand the workflows

CI runs automatically on pushes to `main`, `develop`, `spec/**`, and `impl/**`.

| Workflow file | What it verifies | When it runs |
|---|---|---|
| `ci.yml` | Backend `mvn verify`, frontend lint + test + typecheck, Terraform fmt + validate | Every push and PR |
| `spec-quality.yml` | markdownlint and REQ-ID traceability | When `.md` files or `specs/` change |

- [ ] **When CI fails** — open the Actions tab on GitHub, select the failed run, and read the log.
- [ ] **Fix locally** — reproduce the error with the commands for the prototype created by the team before pushing again.

---

## Team-created infrastructure — Stage 4

The kit does not include provisioned resources, state files or a configured subscription.
If the team's scope includes infrastructure, follow the [Stage 4 guide](../04-evolution/GUIDE.md) and document only what the team creates.

- [ ] Record the modules and configuration files that actually exist.
- [ ] Record validation commands and the plan review outcome.
- [ ] Confirm permissions and limits before deploying.
- [ ] Describe authentication without committing secrets, tokens or state files.
- [ ] If nothing was deployed, state that limitation instead of presenting an environment as ready.

---

## Common problems

| Symptom | Likely cause | Fix | How to confirm |
|---|---|---|---|
| Local environment hangs | Port 5432, 8080, or 3000 is already in use | Run `lsof -i :5432` and stop the process | Service starts without a port error |
| `mvn verify` fails in Testcontainers | Docker is not running | Start Docker Desktop | Tests pass on the next run |
| `pnpm test` fails on snapshots | Component was intentionally changed | Run `pnpm test -- -u` to update snapshots | Tests pass after the update |
| Infrastructure plan is rejected | Configuration does not meet the team's authorized limits or policies | Read the diagnostic and review the plan before deploying | The reviewed plan passes validation |
| GitHub Actions cannot access Azure | Authentication does not match the team's repository, branch or environment | Check the authorized OIDC configuration and ask the access owner for help | The workflow authenticates without committed secrets |

---

## When to escalate to the facilitator

- [ ] Build has failed for more than 20 minutes without a solution.
- [ ] Azure subscription appears to be suspended.
- [ ] Any irreversible action was run by mistake, such as `terraform destroy`.

Use the three-line escalation format described in [`00-TEAM-FLOW.md §4`](../00-TEAM-FLOW.md).

---

### Continue reading

| Previous | Next |
|---|---|
| [FAQ](FAQ.md)<br/><sub>Frequently asked questions.</sub> | [Troubleshooting](troubleshooting.md)<br/><sub>Common errors and solutions.</sub> |

<sub>[Back to the kit index](README.md)</sub>
