# Scrummie-Poker

<p align="center">
  <img height="128" src="./public/icon.svg">
</p>

Scrummie-Poker is a collaborative estimation tool for agile teams, designed to simplify story point estimation through a modern and intuitive interface.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create and manage estimation sessions
- Invite team members to join sessions
- Create or import tickets for estimation
- Real-time voting on ticket estimates
- User authentication and guest access

## Tech Stack

- **Frontend:** React, Vite
  - **Libraries:**
    - tanstack router (app routing)
    - tanstack forms (form state management)
    - yup (for validation)
    - tailwindcss (for styling)
    - ckeditor5 (for rich text editing)
    - papaparse (for CSV ticket import)
    - showdown (for markdown conversion)
- **Backend:** Appwrite
  - **Capabilities:**
    - Auth (user management)
    - Databases (session and ticket storage)
    - Realtime API (live updates)
    - Functions (session invitations and username updates)

## Setup Instructions

### Prerequisites

- Node.js (version 20 or later) or Bun
- Appwrite account and project setup (see [Appwrite Documentation](https://appwrite.io/docs))

### Clone the Repository

```bash
git clone https://github.com/pikami/scrummie-poker.git
cd scrummie-poker
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root directory and add your Appwrite project credentials:

```
VITE_APPWRITE_ENDPOINT=https://<YOUR_APPWRITE_ENDPOINT>
VITE_APPWRITE_PROJECT_ID=<YOUR_PROJECT_ID>
VITE_APPWRITE_DATABASE_ID=<YOUR_DATABASE_ID>
VITE_APPWRITE_ESTIMATION_SESSION_COLLECTION_ID=<YOUR_ESTIMATION_SESSION_COLLECTION_ID>
VITE_SESSION_INVITE_FUNCTION_ID=<YOUR_SESSION_INVITE_FUNCTION_ID>
```

### Start the Development Server

`npm run dev` or `bun run dev`

Your app should now be running on http://localhost:5173.

# Contributing

Contributions are welcome! If you'd like to contribute to Scrummie-Poker, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Open a pull request.

# License

This project is [MIT licensed](./LICENSE).
