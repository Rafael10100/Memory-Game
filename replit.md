# Memory Game

A classic card-matching memory game built with React and Vite.

## Tech Stack

- **Frontend:** React 19 + Vite 7
- **Styling:** CSS
- **Package Manager:** npm

## Project Structure

- `src/App.jsx` — Main game logic (shuffle, match, turn tracking)
- `src/Card.jsx` — Individual card component
- `src/assets/files/files/` — Card face images (JPGs)
- `index.html` — Entry point
- `vite.config.js` — Vite configuration (host: 0.0.0.0, port: 5000, allowedHosts: true)

## Running the App

```bash
npm run dev
```

Runs on port 5000. Configured to allow all hosts for Replit proxy compatibility.

## Deployment

Configured as a **static** deployment:
- Build command: `npm run build`
- Public directory: `dist`
