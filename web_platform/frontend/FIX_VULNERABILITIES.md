Short checklist to fix npm audit findings

1. Inspect
   - npm audit
   - npm audit --json > audit.json

2. Non-breaking fixes
   - npm audit fix

3. Update direct deps
   - npm outdated
   - npm install <package>@<version> --save (or --save-dev)

4. Fix transitive deps (choose one)
   - Add overrides (npm v8+ / npm@7+):
     Add to package.json:
     {
       // ...existing package.json...
       "overrides": {
         "<vulnerable-package>": "<safe-version>"
       }
     }
   - Or use resolutions with npm-force-resolutions:
     - add to package.json:
       {
         // ...existing package.json...
         "resolutions": {
           "<vulnerable-package>": "<safe-version>"
         },
         "scripts": {
           "preinstall": "npx npm-force-resolutions"
         }
       }
     - then run: npm install

5. Force-upgrade (may break):
   - npm audit fix --force

6. Cleanup & reinstall
   - rm -rf node_modules package-lock.json
   - npm install

7. Re-check
   - npm audit

Notes:
- Always run your test suite / manual QA after upgrades.
- For critical transitive vulnerabilities that have no fix, consider filing issues or switching packages.
