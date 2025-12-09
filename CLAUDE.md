# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Form Builder is an Angular 21 application using standalone components with TypeScript strict mode enabled. The project uses Angular's modern architecture without NgModules.

## Development Commands

### Development Server
```bash
ng serve
```
- Runs on port **19240** (custom configuration)
- Listens on **0.0.0.0** (all network interfaces)
- Access at: http://localhost:19240/

Alternative using npm script:
```bash
npm start
```

### Building
```bash
ng build                                    # Production build
ng build --watch --configuration development # Watch mode for development
npm run watch                               # Same as above
```
Production builds output to `dist/` with:
- Bundle size budgets: 500kB warning, 1MB error for initial bundles
- 4kB warning, 8kB error for component styles

### Testing
```bash
ng test        # Run unit tests with Vitest
```

### Code Generation
```bash
ng generate component component-name        # Generate new component
ng generate --help                          # List all available schematics
```

## Deployment

### GitHub Pages
The application is configured to deploy automatically to GitHub Pages via GitHub Actions.

**Workflow**: `.github/workflows/deploy.yml`
- **Triggers**: Automatically on push to `main` branch, or manually via workflow dispatch
- **Build**: Automatically configures `base-href` based on repository type (user/org vs project page)
- **Output**: Deploys `dist/ai-form-builder/browser` to GitHub Pages

**Setup Requirements**:
1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Ensure workflow has proper permissions (configured in workflow file)

**Manual Deployment**:
- Navigate to Actions tab → Deploy to GitHub Pages → Run workflow

## Architecture

### Application Structure
- **Entry Point**: `src/main.ts` - Bootstraps the application with `appConfig`
- **Root Component**: `src/app/app.ts` (class name: `App`) - Uses signals for reactive state
- **Configuration**: `src/app/app.config.ts` - Provides router and global error listeners
- **Routing**: `src/app/app.routes.ts` - Route definitions
- **Styles**: SCSS with global styles in `src/styles.scss`

### Key Architectural Patterns
1. **Standalone Components**: All components are standalone (no NgModules)
2. **Signal-based State**: Uses Angular signals for reactive state management
3. **Functional Providers**: Configuration via provider functions in `appConfig`
4. **Component Naming**: Root component class is `App` (not `AppComponent`)

### TypeScript Configuration
- **Strict Mode**: Enabled with additional strictness flags
  - `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`
- **Angular Compiler**: Strict templates and injection parameters enabled
- **Target**: ES2022

### Styling
- **Preprocessor**: SCSS
- **Component Prefix**: `app`
- **Default Style**: New components generated with SCSS files

### Code Formatting
Prettier is configured with:
- Print width: 100 characters
- Single quotes
- Angular parser for HTML files

## Design Documents
Design documents and architecture diagrams should be placed in the `design-docs/` directory.

## Documentation Maintenance
**Important**: When making significant changes to the codebase:
- Update this CLAUDE.md file to reflect new architectural patterns, commands, or configurations
- Update relevant documentation in `design-docs/` when modifying system design or architecture
- Keep README.md synchronized with any changes to development workflow or setup instructions
