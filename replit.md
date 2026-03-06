# Ericles Barbearia

A barbershop appointment and management system — a single-page web application (SPA) for client bookings, barber scheduling, and admin reporting.

## Project Overview

- **Type:** Static HTML single-page application (SPA)
- **Language:** Vanilla HTML/CSS/JavaScript (ES6+), Portuguese (pt-br)
- **Backend/Database:** Firebase Realtime Database (via CDN)
- **No build system** — served directly as static files
- **Color scheme:** Black, dark gray, white/silver gradients (monochrome)

## User Roles

- **Clients:** Browse services, pick a barber, book time slots, pay via PIX or other methods
- **Barbers (Barbeiro):** View daily agenda, manage availability, register walk-in customers (password: `barbeiro123`)
- **Admins** (password: `ericles123`): Manage services, barbers, commissions, expenses, view reports

## Default Services

- Degradê
- Social
- Barba

## Project Structure

```
index.html        # HTML structure only
styles.css        # All CSS styles
app.js            # All JavaScript logic
server.js         # Simple Node.js HTTP server for development (port 5000)
barber-logo.avif  # Logo image for splash screen
manifest.json     # PWA manifest
```

## Running the App

```bash
node server.js
```

Serves the app at `http://0.0.0.0:5000`.

## Deployment

Configured as a **static** deployment — the root directory (`.`) is the public directory.

## Key Dependencies (CDN)

- Firebase Realtime Database
- Google Fonts (Poppins)

## Firebase

- Database paths use `ericles-barbearia/` prefix
- Firebase project: `ericles-agendamento`
