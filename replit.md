# Easy Design Tool

## Overview
A web-based graphic design tool built with React, TypeScript, and Konva. This application provides a user-friendly interface for creating designs with images, text, shapes, and SVG elements - similar to Canva.

**Current Status**: Successfully imported and configured for Replit environment  
**Last Updated**: October 4, 2025

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
```
src/
├── Assets/           # Icons and shape components
├── Components/       # React components
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

## Recent Changes

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
