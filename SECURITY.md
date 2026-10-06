# Security Policy

## Supported versions

Security fixes are released for the latest published version of `xedonium` on npm. Please upgrade to the latest
version before reporting an issue.

## Reporting a vulnerability

**Please do not report security vulnerabilities in public issues, discussions or pull requests.**

Report them privately using GitHub's
[private vulnerability reporting](https://github.com/ankityadavpurson/xedonium-ui/security/advisories/new)
("Security" tab → "Report a vulnerability").

Please include:

- A description of the issue and its impact.
- The affected version and your environment (browser, React version, bundler).
- Steps to reproduce, ideally a minimal example.
- Any suggested fix, if you have one.

## What to expect

- We aim to acknowledge your report within 5 business days.
- We will confirm the issue, work on a fix, and keep you updated on progress.
- Once a fix is released we will publish a security advisory and credit you, unless you prefer to stay anonymous.

Please give us a reasonable time to fix the problem before disclosing it publicly.

## Scope

xedonium is a client-side UI component library. Relevant issues include, for example, cross-site scripting through a
component's props, and vulnerable or malicious dependencies. Problems in your own application code, or in third-party
packages without a way to exploit them through xedonium, are out of scope.
