# Shared Legacy System — Viewer Access

> **Path:** [Team Kit](../README.md) › [Docs](README.md) › **Legacy Viewer**

The workshop provides one shared Natural/Adabas environment with synthetic SIFAP data. Participants use a restricted viewer role; the facilitator operates the environment separately.

## Sign in

| Field | Value |
|---|---|
| URL | <https://sifap-lab-438k30.eastus2.cloudapp.azure.com/terminal/> |
| Username | `viewer` |
| Password | Shared privately by the facilitator |

## Viewer permissions

The viewer terminal opens the generated `VIEWBENF` Natural program.

- It can query beneficiary data and payment history.
- It has no Adabas write path.
- It cannot open the Adabas administration console.
- It cannot reach the Natural command line.
- It cannot run registration or batch programs.
- It cannot deploy, start, stop, or configure Azure resources.

The viewer is application-level read-only access to a shared runtime. It is not a separate tenant or a private copy of the database.

## If access fails

1. Confirm that you used the exact `/terminal/` URL.
2. Confirm the username is `viewer`.
3. Ask the facilitator to verify the current password and environment status.

Do not attempt to provision, repair, or administer the shared lab from this repository.

---

<sub>[Back to the kit index](../README.md)</sub>
