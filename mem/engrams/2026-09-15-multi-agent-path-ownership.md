---
slug: multi-agent-path-ownership
created: 2026-09-15
weight: 0.92
tags: [github, agents, race]
source: incident
---
# What happened
Four agents tried to create the same new files. The duplicate-push guard fired while main still lacked the files.

# Why it matters
One writer per path. Use push_files for a companion set. Confirm before retry.

# Trigger
Multi-agent GitHub writes on one branch.
