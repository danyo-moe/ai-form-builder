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
- 8kB warning, 12kB error for component styles

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

## Headless Dynamic Form System

### Overview
This application provides a **headless, configuration-driven dynamic form system** designed for complete styling flexibility. The architecture separates form logic from presentation, allowing business users to create custom forms and apply different visual themes.

### Architecture: Headless UI Pattern

The form component is completely **headless** - it contains zero styling and exposes all state through `data-*` attributes. This allows:
- Complete styling freedom without component modifications
- Easy integration into any design system
- Business users can create forms without developer involvement
- Multiple visual themes can be applied to the same form

### Core Components

#### 1. Dynamic Form Component (`src/app/components/dynamic-form/`)
The headless form renderer that generates forms from configuration.

**Key Features**:
- **Headless**: No default styling, empty CSS file
- **State Exposure**: All component state exposed via `data-*` attributes
- **Configuration-Driven**: Forms generated from JSON configuration objects
- **Validation**: Built-in validators with real-time error feedback
- **Local Storage**: Automatic save/load of incomplete forms
- **Auto-Save**: Configurable interval-based saving
- **Reactive**: Uses Angular signals for state management

**Component API**:
- **Input**: `config: FormConfig` - Form configuration object
- **Outputs**:
  - `formSubmit` - Emitted on successful validation with form data
  - `formSave` - Emitted on save (manual or auto-save) with form data
  - `validationErrors` - Emitted on validation state changes with error array

**Data Attributes for Styling**:

Form-level attributes:
- `data-form-id`: Unique form identifier
- `data-form-valid`: "true" | "false" - Overall form validation state
- `data-form-dirty`: "true" | "false" - Whether form has been modified
- `data-form-touched`: "true" | "false" - Whether form has been interacted with

Field-level attributes:
- `data-field-name`: Field identifier (e.g., "email", "firstName")
- `data-field-type`: Field type ("text", "email", "number", "textarea", "date")
- `data-field-valid`: "true" | "false" - Field validation state
- `data-field-touched`: "true" | "false" - Whether field has been focused
- `data-field-dirty`: "true" | "false" - Whether field value has changed
- `data-field-disabled`: "true" | "false" - Whether field is disabled
- `data-field-required`: "true" | "false" - Whether field is required

Error and action attributes:
- `data-validation-error`: Present on validation error containers
- `data-action`: Button type ("submit" | "save")

#### 2. Form Builder Component (`src/app/components/form-builder/`)
Visual form builder UI for business users to create custom forms without coding.

**Key Features**:
- Visual drag-and-drop field ordering
- Field configuration (name, label, type, placeholder, disabled state)
- Validation rule builder with multiple validation types
- Save/load form configurations from local storage
- JSON import/export for sharing configurations
- Real-time preview integration
- Message notifications for user actions

**Important Implementation Details**:
- Uses helper methods instead of inline spread operators (Angular template limitation)
- Initialization happens in constructor (not at declaration) to avoid dependency issues
- All state managed with signals for reactivity

**Form Builder API**:
- **Output**: `configChanged: FormConfig` - Emitted when form configuration changes

#### 3. Form Builder Service (`src/app/services/form-builder.ts`)
Manages persistence of custom form configurations.

**Key Methods**:
- `saveConfig(config: FormConfig)`: Save configuration to local storage
- `loadConfig(id: string)`: Load configuration by ID
- `getAllConfigs()`: Get all saved configurations
- `deleteConfig(id: string)`: Delete a configuration
- `createBlankConfig()`: Create new blank form template
- `exportConfig(config: FormConfig)`: Export as JSON string
- `importConfig(json: string)`: Import from JSON string

**Storage Key**: `form_configs` - Stores array of all configurations

#### 4. Form Storage Service (`src/app/services/form-storage.ts`)
Manages persistence of form submission data.

**Key Methods**:
- `saveForm(formId, data, isComplete)`: Save form data
- `loadForm(formId)`: Load saved form data
- `clearForm(formId)`: Delete saved data
- `hasStoredForm(formId)`: Check if data exists
- `getAllForms()`: Get all saved form submissions

**Storage Key Pattern**: `dynamic_form_{formId}` - Individual form data

### Theming System

The application includes three example themes demonstrating different styling approaches:

#### 1. Minimal Theme (`src/styles/form-themes/minimal.scss`)
- Clean, simple aesthetic
- Monochrome color scheme
- Minimal borders and spacing
- System fonts

#### 2. Modern Theme (`src/styles/form-themes/modern.scss`)
- Vibrant gradient buttons
- Rounded corners and shadows
- Blue accent color (#3b82f6)
- Contemporary design

#### 3. Classic Theme (`src/styles/form-themes/classic.scss`)
- Traditional serif fonts (Georgia)
- Double borders
- Earth-tone colors
- Centered layout

**Styling Pattern**:
All themes use attribute selectors to style the headless component:
```scss
// Target forms by data attribute
form[data-form-id] {
  /* form styles */
}

// Target fields by state
[data-field-valid="false"] input {
  border-color: red;
}

// Target buttons by action type
button[data-action="submit"] {
  background: blue;
}
```

### Test Harness

The main application (`src/app/app.ts` and `src/app/app.html`) provides a test harness with two views:

#### Builder View
- Visual form builder interface
- Add/edit/remove fields
- Configure validations
- Save/load configurations
- Import/export JSON

#### Preview & Test View
- Theme selector (Minimal, Modern, Classic)
- Live form preview with selected theme
- Functional form submission
- Display submission results
- Documentation of data attributes

### Supported Field Types
- `text`: Standard text input
- `email`: Email input with validation
- `number`: Number input
- `textarea`: Multi-line text area
- `date`: Date picker

**Note**: Select, checkbox, and radio types are defined in the interface but not yet implemented.

### Validation Types
- `required`: Field must have a value
- `email`: Must be valid email format
- `minLength`: Minimum character length (requires value)
- `maxLength`: Maximum character length (requires value)
- `min`: Minimum numeric value (requires value)
- `max`: Maximum numeric value (requires value)
- `pattern`: Must match regex pattern (requires value)
- `custom`: Custom validation function (requires validator function)

### File Structure
```
src/
├── app/
│   ├── components/
│   │   ├── dynamic-form/            # Headless form component
│   │   │   ├── dynamic-form.ts
│   │   │   ├── dynamic-form.html
│   │   │   └── dynamic-form.scss    # Empty (headless)
│   │   └── form-builder/            # Visual form builder
│   │       ├── form-builder.ts
│   │       ├── form-builder.html
│   │       └── form-builder.scss
│   ├── models/
│   │   └── form-config.interface.ts # Type definitions
│   ├── services/
│   │   ├── form-storage.ts          # Form data persistence
│   │   └── form-builder.ts          # Config persistence
│   ├── app.ts                       # Test harness component
│   ├── app.html                     # Test harness template
│   └── app.scss                     # Test harness styles
└── styles/
    └── form-themes/                 # Example themes
        ├── minimal.scss
        ├── modern.scss
        └── classic.scss
```

### Usage Example

```typescript
// 1. Create form configuration
const contactForm = signal<FormConfig>({
  id: 'contact-form',
  submitLabel: 'Send Message',
  saveLabel: 'Save Draft',
  autoSave: true,
  autoSaveInterval: 5000,
  fields: [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'you@example.com',
      order: 0,
      validations: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email' }
      ]
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Your message here...',
      order: 1,
      validations: [
        { type: 'required', message: 'Message is required' },
        { type: 'minLength', value: 10, message: 'Message must be at least 10 characters' }
      ]
    }
  ]
});

// 2. Use in template
<app-dynamic-form
  [config]="contactForm()"
  (formSubmit)="handleSubmit($event)"
  (formSave)="handleSave($event)"
  (validationErrors)="handleErrors($event)"
/>

// 3. Create custom theme (in your SCSS file)
form[data-form-id="contact-form"] {
  padding: 2rem;
  background: white;
  border-radius: 8px;

  [data-field-name] {
    margin-bottom: 1rem;
  }

  [data-field-required="true"] label::after {
    content: " *";
    color: red;
  }

  [data-field-valid="false"] input {
    border: 2px solid red;
  }

  [data-validation-error] {
    color: red;
    font-size: 0.875rem;
  }

  button[data-action="submit"] {
    background: blue;
    color: white;
    padding: 0.75rem 2rem;
  }
}
```

### Extending the System

**Adding New Field Types**:
1. Add type to `FieldType` in `form-config.interface.ts`
2. Add rendering logic in `dynamic-form.html` using `@switch/@case`
3. Update form-builder field type dropdown
4. Add corresponding `data-field-type` attribute
5. Create theme styles for new field type

**Adding New Validation Types**:
1. Add type to `ValidationRule` in `form-config.interface.ts`
2. Update `getValidators()` method in `dynamic-form.ts`
3. Add to `validationTypes` array in `form-builder.ts`
4. Update validation editor UI in `form-builder.html`

**Creating New Themes**:
1. Create new SCSS file in `src/styles/form-themes/`
2. Use attribute selectors targeting `data-*` attributes
3. Import theme in `src/app/app.scss`
4. Add theme to themes array in `app.ts`

### Important Angular Template Limitations

When working with Angular templates in this project, be aware:
- **No spread operators**: Use helper methods instead of `{ ...obj, prop: value }`
- **No arrow functions**: Create component methods instead of inline `() => {}`
- **No complex expressions**: Keep template expressions simple, move logic to component

## Design Documents
Design documents and architecture diagrams should be placed in the `design-docs/` directory.

## Documentation Maintenance
**Important**: When making significant changes to the codebase:
- Update this CLAUDE.md file to reflect new architectural patterns, commands, or configurations
- Update relevant documentation in `design-docs/` when modifying system design or architecture
- Keep README.md synchronized with any changes to development workflow or setup instructions
