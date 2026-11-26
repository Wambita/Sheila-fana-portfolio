# 01 — Problem Statement

**Status:** Draft for owner review.

## Problem

A professional who works across several disciplines (software, UI/UX, cybersecurity, AI, robotics and emerging technologies) runs into three problems with a conventional portfolio or CV:

1. **Dilution.** One linear page buries the work that matters to a given reader. A security recruiter has to scroll past design work, and the reverse.
2. **Duplication.** Keeping a separate CV or page for each discipline means the same project, role or certification gets copied and edited in many places, and the copies drift apart.
3. **Shallow credibility.** Research-oriented work, such as publications, methods and community contributions, rarely fits the format of a typical portfolio template.

## Goals

- G1: One source of truth for every content item, reused across discipline pages, recruiter views and CVs.
- G2: A reader reaches the work relevant to them within one or two clicks or a single shared link.
- G3: An editorial, research-grade presentation that conveys rigour and clarity.
- G4: Accessible (WCAG 2.2 AA), fast and secure by default.
- G5: An architecture that grows into a secure admin dashboard without a rewrite.

## Non-goals (v1)

- Multi-user or multi-tenant use.
- A blogging platform or CMS for third parties.
- Public user accounts, comments or social features.

## Success measures (proposed; targets to be agreed)

- Lighthouse score of 95 or more for Performance, Accessibility, Best Practices and SEO on key pages.
- No critical or serious axe violations.
- Adding a new discipline, project or recruiter view requires data changes only, with no code changes.
