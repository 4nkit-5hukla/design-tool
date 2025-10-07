# Easy Design Tool

## Overview
Easy Design Tool is a web-based graphic design application, similar to Canva, built with React, TypeScript, and Konva. It offers a user-friendly interface for creating designs using images, text, shapes, and SVG elements. The project's ambition is to provide a comprehensive and intuitive design experience.

## User Preferences
- Use CSS/SCSS Modules for component styling
- Build with better architecture and solid patterns
- Prioritize fixing critical issues (multi-select, image crop, Unsplash pagination)

## System Architecture

### Tech Stack
-   **Frontend Framework**: React 19 with TypeScript
-   **Build Tool**: Vite 7
-   **Canvas Library**: Konva (React-Konva)
-   **UI Framework**: Material-UI (MUI) v7
-   **Routing**: React Router v6
-   **State Management**: React Context API

### Key Features
-   Drag-and-drop canvas interface
-   Multi-element selection and transformation
-   Text editing with custom fonts (Google Fonts integration)
-   Image manipulation (crop, flip, filters, shadows, strokes)
-   SVG and shape support (rectangles, circles, stars, triangles)
-   Undo/redo functionality
-   Template system
-   Export/save functionality

### Project Structure
The project follows a modular structure:
```bash
src/
├── Assets/          # Icons and shape components
├── Components/      # React components (UI, Utils)
├── Configs/         # Configuration and theme
├── Contexts/        # React contexts for state management
├── Hooks/           # Custom React hooks
├── Interfaces/      # TypeScript interfaces
├── Layout/          # Layout components
├── Pages/           # Page components
└── Routes/          # Router configuration
```

### Technical Implementations
-   **TypeScript Type System**: A comprehensive `CanvasElement` union type system has been implemented in `src/Interfaces/Elements.ts`, replacing generic Konva types with specific interfaces for 9 element types (TextElement, ImageElement, ClippedImageElement, etc.). This ensures end-to-end type safety.
-   **Multi-selection & Resizing**: The `useMultiSelect` hook provides robust multi-element selection, transformation, and resizing capabilities, including handling all 9 element types. Transform handles are properly rendered via useEffect-based attachment to ensure correct display.
-   **Color Picker**: `react-color` (ChromePicker) is integrated for color selection across various components.
-   **Debounced History System** (Oct 2025): Implemented intelligent history management with 300ms debounced saving to improve performance. Critical flush logic ensures pending changes are saved before undo/redo operations to prevent data loss. The system properly handles text element scaling through fixTextShapes coordination with use-undo library.

### Rebuild Progress (October 7, 2025)
**Status**: Phase 1 & 2 Complete - New Architecture Foundation Ready

**New Implementation** (in `src/` alongside old code):
-   **New Type System** (`src/types/`): Clean TypeScript interfaces for elements, canvas, history, and Unsplash
-   **New Contexts** (`src/contexts/`): Elements, Selection, History, and Canvas contexts with improved state management
-   **Multi-Select Fixed** (`src/hooks/useMultiSelect.ts`): 
    - ✅ Rotation-aware bounding box calculation
    - ✅ Transform preservation using element centers (not corners)
    - ✅ Works incrementally on current state (no stale data issues)
    - ✅ Supports consecutive operations without data loss
    - ✅ **ARCHITECT REVIEWED AND APPROVED**
-   **Canvas Components** (`src/components/`):
    - Canvas Stage with Konva integration
    - Element renderers (Text, Image, Shape, SVG) with CSS Modules
    - Transformer hook for selection handling

**Known Issues to Fix** (Phase 3):
1. Image crop functionality - needs implementation
2. Unsplash pagination bug - last 3 items of page N duplicate on page N+1
3. Image swap feature - need dialog to change/swap images
4. Integration - new architecture needs to be wired into existing app

**Next Agent Tasks**:
- See `REBUILD_PLAN.md` for detailed Phase 3-5 roadmap
- See `.local/state/replit/agent/progress_tracker.md` for checklist

## External Dependencies

-   **Unsplash API**: Used for image integration (requires `REACT_APP_UNSPLASH_ACCESS_KEY`).
-   **Google Fonts**: Integrated for custom text fonts.
-   **Konva**: A 2d canvas library for desktop and mobile development.
-   **Material-UI (MUI)**: React component library for faster and easier web development.
-   **React Router**: For declarative routing.
-   **react-color**: Color picker component.
-   **uuid**: For generating unique IDs.
-   **use-undo**: For managing undo/redo functionality.