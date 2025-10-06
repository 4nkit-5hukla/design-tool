# Easy Design Tool

## Overview

A web-based graphic design tool built with React, TypeScript, and Konva. This application provides a user-friendly interface for creating designs with images, text, shapes, and SVG elements - similar to Canva.

**Current Status**: TypeScript Type System Improvement In Progress  
**Last Updated**: October 6, 2025

## Project Architecture

### Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Canvas Library**: Konva (React-Konva)
- **UI Framework**: Material-UI (MUI) v7
- **Routing**: React Router v6
- **State Management**: React Context API

### Key Features

- Drag-and-drop canvas interface
- Multi-element selection and transformation
- Text editing with custom fonts (Google Fonts integration)
- Image manipulation (crop, flip, filters, shadows, strokes)
- SVG and shape support (rectangles, circles, stars, triangles)
- Undo/redo functionality
- Template system
- Unsplash image integration (requires API key)
- Export/save functionality

### Project Structure

```bash
src/
├── Assets/          # Icons and shape components
├── Components/      # React components
│   ├── UI/          # UI components (toolbar, tools, elements)
│   └── Utils/       # Utility components
├── Configs/         # Configuration and theme
├── Contexts/        # React contexts for state management
├── Hooks/           # Custom React hooks
├── Interfaces/      # TypeScript interfaces
├── Layout/          # Layout components
├── Pages/           # Page components (Home, Preview, 404)
└── Routes/          # Router configuration
```

## TypeScript Type System Improvement (In Progress)

### Goal
Systematically eliminate all `any`, `unknown`, and `never` types across the entire codebase, replacing them with proper, specific TypeScript types. This improves type safety, IDE support, and reduces runtime errors.

### Approach
Working hierarchically from the application entry point (main.tsx) through all components, hooks, contexts, and utilities. Each file is analyzed for type issues and fixed with proper interfaces and type definitions.

### Progress Tracking

#### Completed (60%)
- ✅ **Entry Point** (2 files): main.tsx, App.tsx - Already clean
- ✅ **Interfaces** (9 files): Created new Hooks.ts, fixed ComponentProps.ts export conflicts
- ✅ **Contexts** (3 files): 
  - AppState.tsx: Fixed `unknown` types in FontMeta and fontsData
  - Elements.tsx: Fixed `any` types for stage/layer/selectedEl/event handlers
  - History.tsx: Already clean
- ✅ **Hooks** (17 files): Fixed all hooks
  - useFilter.ts: Removed 5 `any` types
  - useZoom.ts: Fixed origin parameter type
  - useDraggable.ts: Fixed `any` for updateElement param and selected state
  - useEventListener.ts: Added generic event type
  - useAxios.ts: Proper AxiosError typing
  - useElements.ts: Removed `any` from duplicateElement and copyElement
  - useResizer.ts: Fixed container type
  - useElementCache.ts: Used DependencyList instead of `any[]`
  - useFocusable.ts: Added Konva event type
  - useDebounce.ts: Made generic
  - useTransformer.ts: Removed `any` from transformer type
  - useStorage.ts: Improved error handling types
  - useClickOutside.ts: Proper RefObject and MouseEvent types
- ✅ **Configs** (1 file): defaultValues.tsx - Fixed colorObj type
- ✅ **Assets** (5 files): 
  - Shapes/index.tsx: Added SolidShapeProps interface
  - ComplexShapes/index.tsx, Shape1.tsx, Shape2.tsx, Shape3.tsx: Added ShapeData interface
- ✅ **Pages** (3 files): All already clean
- ✅ **Routes** (1 file): Already clean
- ✅ **Utils** (1 file): Components/Utils/GoogleFont.tsx - Fixed all `any` types

#### In Progress (20%)
- **UI Components** (~47 files remaining): Elements, Tools, ToolBar, Fields

#### Pending Analysis & Fixes (20%)
- **UI Element Components** (11 files):
  - TransformableImageExp.tsx (9 any/unknown)
  - TransformableImage.tsx (5)
  - EditableText.tsx (5)
  - ClippedImage.tsx (5)
  - TransformableSVG.tsx (5)
  - TransformableStar.tsx (4)
  - TransformableRect.tsx (3)
  - TransformableTriangle.tsx (2)
  - TransformableSinglePath.tsx (2)
  - CropableImage.tsx (2)
  - TransformableCircle.tsx (1)
- **UI Tool Components** (~25 files): Text/Shadow, Text/Stroke, Shape/Shadow, SVG, Photos, Templates, Shapes, Elements
- **UI Toolbar Components** (~5 files): Top.tsx, TopTools/*
- **UI Field Components** (1 file): NumberField.tsx
- **Other Components** (5 files): Header.tsx, CanvasStage.tsx, Stage.tsx

### Type Issues Found
Based on initial scan, found `any`/`unknown`/`never` usage in approximately 70+ files across:
- Hooks: useEventListener (2), useElements (2), useFilter (5), useAxios (4)
- Components: Stage (7), Header (4), CanvasStage (5), Templates (7), Top toolbar (7)
- UI Elements: TransformableImageExp (9), TransformableImage (5), EditableText (5)
- And many more throughout the codebase

### Common Type Patterns & Solutions

Based on work completed so far, here are common patterns and their solutions:

**1. Event Handlers**
```typescript
// ❌ Bad
const handler = (e: any) => { ... }

// ✅ Good  
const handler = (e: Konva.KonvaEventObject<MouseEvent>) => { ... }
const handler = (e: MessageEvent) => { ... }
const handler = (e: KeyboardEvent) => { ... }
```

**2. Ref Types**
```typescript
// ❌ Bad
const ref: any

// ✅ Good
const ref: RefObject<HTMLElement>
const ref: RefObject<Konva.Stage>
const ref: MutableRefObject<T>
```

**3. Generic Functions**
```typescript
// ❌ Bad
const useDebounce = (value: any, delay: number) => { ... }

// ✅ Good
const useDebounce = <T>(value: T, delay: number): T => { ... }
```

**4. Component Props**
```typescript
// ❌ Bad
const MyComponent = (props: any) => { ... }

// ✅ Good
interface MyComponentProps {
  width: number;
  height: number;
  data: DataType[];
}
const MyComponent = ({ width, height, data }: MyComponentProps) => { ... }
```

**5. Error Handling**
```typescript
// ❌ Bad
catch (err: any) { return err.message }

// ✅ Good
catch (err) {
  const error = err as Error;
  return error.message;
}
```

**6. Optional Chaining for Undefined**
```typescript
// When types are X | undefined, use optional chaining
layer?.toDataURL()
transformer.current?.nodes([ref.current])
selectedEl?.y ?? 0
```

### Instructions for Future Agents

If resuming this work:
1. Check this section to see what's completed (60% done)
2. **Start with UI Components** (47 files remaining)
   - Begin with Elements: TransformableImage, EditableText, etc.
   - Then Tools: Text/Shadow, Text/Stroke, Shape/Shadow, etc.
   - Then ToolBar and Fields
3. For each file:
   - Read the file and identify all `any`, `unknown`, `never` types
   - Check `src/Interfaces/ComponentProps.ts` for existing prop interfaces (ToolbarProps, ShadowProps, etc.)
   - Check `src/Interfaces/Elements.ts` for element-related types
   - Create new interfaces in appropriate Interface files if needed
   - Replace weak types with specific, proper types
   - Use the patterns above as examples
4. Common component type patterns:
   - Most toolbar components use `ToolbarProps` or `ShadowProps`/`StrokeProps`
   - Transformable elements use `TransformableElementProps`
   - Always type Konva event handlers properly
5. Test after fixing each category (Elements, Tools, ToolBar, Fields)
6. Update this progress section with completion status
7. Call architect for review before marking complete

## Recent Changes

### October 6, 2025 - TypeScript Type System Improvement (60% Complete)
- **Completed**: Systematically eliminated `any`, `unknown`, and `never` types from foundational codebase layers
- **Files Fixed** (24 files):
  - All 13 Hook files: useFilter, useZoom, useDraggable, useEventListener, useAxios, useElements, useResizer, useElementCache, useFocusable, useDebounce, useTransformer, useStorage, useClickOutside
  - All 3 Context files: AppState, Elements, History
  - 1 Config file: defaultValues
  - 5 Asset files: Shapes/index, ComplexShapes (index, Shape1, Shape2, Shape3)
  - 1 Interface file: Created new Hooks.ts for shared hook parameter types
  - 1 Util file: GoogleFont
- **Type Improvements**:
  - Replaced event handler `any` with proper Konva.KonvaEventObject types
  - Fixed ref types with RefObject<T> and MutableRefObject<T>
  - Made hooks generic where appropriate (e.g., useDebounce<T>)
  - Added proper error handling types (Error instead of any)
  - Created shared interfaces for hook parameters (UseDraggableParams, UseZoomParams, etc.)
- **Verification**: 
  - Application running successfully with no LSP errors
  - All changes reviewed and approved by architect
  - No functional regressions detected
- **Documentation**: Updated replit.md with comprehensive progress tracking, common patterns, and instructions for future agents
- **Remaining Work** (~40%): UI Components (47 files in Elements, Tools, ToolBar, Fields directories)

### October 6, 2025 - Replit Import Completed
- Installed Node.js 20 and all 473 npm packages successfully
- Vite development server running on port 5000
- Application verified working in Replit environment
- Started TypeScript type system improvement initiative

### October 4, 2025 - TypeScript Migration & Package Updates

- **TypeScript Conversion**: Converted all JavaScript files to TypeScript
  - `MultiSelect.jsx` → `MultiSelect.tsx` with proper prop types
  - `CropableImage.jsx` → `CropableImage.tsx` with type annotations
  - `ClippedImage.jsx` → `ClippedImage.tsx` with type annotations
  - `useMultiSelect.js` → `useMultiSelect.ts` with type annotations
- **Type System Improvements**:
  - Created comprehensive interfaces and enums in `src/Interfaces/Elements.ts`
  - Added `Mode`, `Anchor`, `Action` enums for better type safety
  - Defined `ImageElementState` and `ClippedImageElementState` interfaces
  - Added `CropableImageProps` and `ClippedImageProps` interfaces
- **History Management**: Updated to properly use `use-undo` package
  - Refactored `History.tsx` to follow use-undo API correctly
  - Improved undo/redo functionality with proper state management
- **Package Updates**: Updated all dependencies to latest versions
  - **Removed**: `mui-color` (incompatible with MUI v7)
  - **Added**: `react-color` v2.19.3 as replacement
  - **Updated Major Packages**:
    - `konva`: 9.3.22 → 10.0.2
    - `react-router-dom`: 6.30.1 → 7.9.3
    - `react-konva-utils`: 1.1.3 → 2.0.0
    - `uuid`: 11.1.0 → 13.0.0
    - `@mui/material`: 7.2.0 → 7.2.4
    - `@mui/icons-material`: 7.2.0 → 7.2.4
    - `@mui/lab`: 7.0.0-beta.14 → 7.0.1-beta.18
    - `@vitejs/plugin-react`: 4.6.0 → 5.0.4
    - `eslint-plugin-react-hooks`: 5.2.0 → 6.1.1
    - `typescript`: 5.8.3 → 5.9.3
- **Breaking Changes Fixed**:
  - Replaced `ColorBox` from `mui-color` with `ChromePicker` from `react-color` across 9 files
  - Updated color picker API usage (`value` → `color`, updated onChange handlers)
- **Build System**: Successfully removed `--legacy-peer-deps` requirement
  - All packages now install cleanly with standard `npm install`
  - No peer dependency conflicts

### October 4, 2025 - Replit Environment Setup (GitHub Import)

- Successfully imported project from GitHub to Replit
- Installed Node.js 20 and all npm dependencies (473 packages)
- Fixed dependency conflicts:
  - Replaced `mui-color` with `react-color` (ChromePicker) in shadow and stroke color components
  - Updated import statements and API usage to match react-color
- Configured Vite to work with Replit's proxy system:
  - Set host to `0.0.0.0` for port 5000
  - Changed `allowedHosts` from array to `true` to allow all hosts (required for Replit iframe proxy)
  - Enabled HMR (Hot Module Replacement) for live updates
- Set up Frontend workflow running on port 5000 with webview output
- Configured deployment settings for autoscale:
  - Build: `npm run build`
  - Run: `npx vite preview --host 0.0.0.0 --port 5000`
- Application successfully tested and verified working in Replit environment

## Development

### Running Locally

The development server runs automatically via the configured workflow:

```bash
npm run dev
```

The app will be available at `http://localhost:5000`

### Building for Production

```bash
npm run build
```

Output directory: `build/`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run preview` - Preview production build

## Configuration Notes

### Environment Variables

The project uses `REACT_APP_` prefix for environment variables (configured in `vite.config.ts`).

To use Unsplash images, you'll need to set:

- `REACT_APP_UNSPLASH_ACCESS_KEY`

### Dependency Notes

- All packages are now on latest versions with full compatibility
- No longer requires `--legacy-peer-deps` flag
- Uses `react-color` instead of `mui-color` for color picking functionality
- Node modules and lock files are gitignored

## Known Issues

- Unsplash API calls return 401 without proper API key configuration (expected behavior - requires REACT_APP_UNSPLASH_ACCESS_KEY)
- Minor TypeScript LSP diagnostics in some files (non-breaking, cosmetic type improvements pending)

## User Preferences

None configured yet.

## Deployment

The app is configured for Replit autoscale deployment:

- Build command: `npm run build`
- Run command: `npx vite preview --host 0.0.0.0 --port 5000`
- Type: Autoscale (stateless, scales to zero when not in use)
- Output directory: `build/`
