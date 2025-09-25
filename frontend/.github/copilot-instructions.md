# Copilot Instructions for Automobile Management System Frontend

## Project Overview
- This is a React + Vite frontend for an Automobile Management System.
- The project uses Vite for fast development and HMR, with React as the UI library.
- CSS modules are used for component-level styling.
- The codebase is organized by feature: `components/`, `removal/`, `store/`, and `public/`.

## Key Architectural Patterns
- **Feature-based structure:** Components are grouped by domain (e.g., `Auth`, `Home`, `mechanics`, `services`, `removal`).
- **Context API:** Used for authentication state management (`components/context/AuthContext.jsx`).
- **State Management:** Local state and context; no Redux or MobX detected.
- **Routing:** Not explicitly present; if needed, add React Router in `src/main.jsx`.
- **Store pattern:** Mechanics data is managed in `src/store/mechanicsStore.jsx`.

## Developer Workflows
- **Start Dev Server:**
  ```sh
  npm run dev
  ```
- **Build for Production:**
  ```sh
  npm run build
  ```
- **Lint:**
  ```sh
  npm run lint
  ```
- **No test scripts detected.** Add tests in `src/__tests__/` and update `package.json` if needed.

## Project-Specific Conventions
- **CSS Modules:** All styles are local to their components (e.g., `Mechanics.module.css`).
- **Component Naming:** Components are PascalCase and reside in feature folders.
- **Auth Flow:** Login/Register handled in `components/Auth/`, with context in `components/context/AuthContext.jsx`.
- **Removal Features:** Customer/Manager removal logic is in `removal/Customer/` and `removal/Manager/`.

## Integration Points
- **Images:** Stored in `public/images/` and referenced in components.
- **No backend API integration detected.** Add API calls in feature components as needed.
- **External dependencies:**
  - React
  - Vite
  - ESLint (see `eslint.config.js`)

## Examples
- To add a new feature, create a folder in `src/components/` and use CSS modules for styling.
- To update authentication logic, modify `AuthContext.jsx` and related components in `Auth/`.

## References
- Main entry: `src/main.jsx`
- App root: `src/App.jsx`
- Auth context: `src/components/context/AuthContext.jsx`
- Mechanics store: `src/store/mechanicsStore.jsx`

---
**Update this file if you add new workflows, major dependencies, or architectural changes.**
