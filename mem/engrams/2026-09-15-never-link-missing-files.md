---
slug: never-link-missing-files
created: 2026-09-15
weight: 0.93
tags: [docs, github, 404]
source: incident
---
# What happened
README eee9b11 linked USAGE, CHANGELOG, AGENTS, and MEMORY before those files existed on main.

# Why it matters
Companions land first, or in the same commit as the links. Confirm with get_file_contents.

# Trigger
Adding new doc links during a README rewrite.
