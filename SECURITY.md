# Security Policy

## Supported versions

| Version | Supported           |
|---------|---------------------|
| 0.6.x   | Yes                 |
| 0.5.x   | Security fixes only |
| < 0.5   | No                  |

## Reporting a vulnerability

Please report vulnerabilities privately to `security@truewell.example` or through GitHub's
"Report a vulnerability" form on the Security tab. Do not open a public issue.

Include, where possible:

- A description of the issue and its impact
- Steps to reproduce or a proof of concept
- Affected version or commit
- Any suggested mitigation

Never include real patient information in a report. Use fictional records.

You can expect an acknowledgement within 3 business days and a status update within 10. We will
credit reporters in the release notes unless they prefer to stay anonymous.

## Scope

In scope: the web app and its API routes, the Python API, the notifier and worker services,
Docker images, Kubernetes manifests and CI workflows in this repository.

Out of scope: social engineering, denial of service through volumetric traffic, and findings that
require a compromised administrator account.

## Design notes

Truewell implements technical safeguards commonly expected of software that handles protected health
information, such as role-based access control, audit logging and encryption in transit. Using this
software does not by itself make a deployment compliant with any regulation or standard. See
[docs/security.md](docs/security.md) for the safeguards and the operator responsibilities that remain.
