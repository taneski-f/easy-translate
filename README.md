# EasyTranslate

A "full-stack" workspace built with Vue 3 (frontend) and Node.js (backend proxy).

## Features
- Project and folder management
- Responsive UI with theme and language toggling
- End-to-end and unit tests

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Setup
Clone the repository:
```sh
git clone https://github.com/taneski-f/easy-translate.git
cd easy-translate
```

Install dependencies for both frontend and backend:
```sh
cd FE
npm install
cd ../BE
npm install
```

### Running the Frontend
```sh
cd FE
npm run dev
```

### Running the Backend
```sh
cd BE
node server.js
```

### Running Tests
- **Unit tests (frontend):**
  ```sh
  cd FE
  npm run test:unit
  ```
- **E2E tests (frontend):**
  ```sh
  cd FE
  npm run test:e2e
  ```

## Folder Structure
- `FE/` — Frontend Vue 3 app
- `BE/` — Backend Node.js server

## Notes
- Example tests are provided; coverage is not exhaustive.
- For Playwright E2E tests, Inspector opens by default for step-by-step debugging.
- See `FE/README.md` and `BE/README.md` for more details on each part.


