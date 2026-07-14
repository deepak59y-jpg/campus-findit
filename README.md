# Campus FindIt 🔍

A lost-and-found platform for college campuses. When someone loses an item,
they post it. When someone finds an item, they report it — connecting the
two automatically instead of relying on notice boards and word of mouth.

**Live:** [campus-findit.vercel.app](https://campus-findit.vercel.app)

## Features
- Post a lost item with details and description
- Report a found item to help reunite it with its owner
- User authentication with JWT — secure, protected routes
- Full CRUD operations on item listings
- Responsive UI, works across devices

## Tech Stack
**Frontend:** React, CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB
**Auth:** JWT (JSON Web Tokens)
**Deployment:** Vercel

## Architecture
- `/client` — React frontend
- `/server` — Express API, MongoDB models, JWT auth middleware

## Why I built this
Every campus has the same problem — lost ID cards, water bottles, notebooks
that never make it back to their owner because there's no central place to
report or search for them. Campus FindIt solves this with a simple, focused
report-and-search flow instead of scattered WhatsApp groups or notice boards.
