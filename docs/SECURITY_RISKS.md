# Alphaiota BMS security cautions

- Run `npm audit` in `frontend-react/` against the current lockfile and review advisories before deployment. At this rebrand's verification, npm reported two moderate React Router advisories; npm's proposed automatic fix requires a major upgrade. Recheck as advisories change.
- The UI's ability checks improve navigation but do not replace server-side authorization or unit scoping. Test the actual Laravel endpoints and roles in an isolated environment before release.
- Historical backend reviews flagged two policy questions as unresolved: visibility of audit events for products shared between units, and the company-to-business-unit ownership assumed by employee import. These may affect confidentiality and tenant isolation. Review the current code and verify the owner decisions described in the [historical contract audit](bms/PHASE_3_5_CONTRACT_DECISIONS.md) before changing those policies or deploying.
- Some frontend actions do not yet have matching Laravel endpoints. See the explicit matrix in [`../frontend-react/README.md`](../frontend-react/README.md); an unsuccessful live request is not simulated as a success.
- The locked backend dependencies have PHP-version constraints that CI currently bypasses for installation. Perform a native runtime and Composer security review before release. Existing data, role seeders, CORS, JWT secrets, file access, backups and infrastructure also need a deployment-specific review.
- Never commit real secrets, service-account files or uploads. Rotate any previously exposed credentials.

The previous dependency audit is an [archived historical record](https://github.com/DevMagdi/fgsportal/blob/72953827d23608af32201d03065ef85f08fc5b85/docs/SECURITY_RISKS.md); its findings describe the earlier dependency set and must not be presented as an audit of the current React application.
