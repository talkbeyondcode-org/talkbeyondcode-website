---
kind: Link
tag: Tooling
title: Prefer strict tables in SQLite
date: 2026-07-11
source:
  label: evanhahn.com
  href: 'https://evanhahn.com/prefer-strict-tables-in-sqlite/'
---
Plain SQLite will happily store "banana" in an INTEGER column. Add STRICT to the table and it throws instead. There's no ALTER path for existing tables, so adopt it one migration at a time.
