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
**Status**: Phase 4 In Progress - Integration Started

**Phase 1-3 Complete** (New Architecture Foundation):
-   **New Type System** (`src/types/`): Clean TypeScript interfaces for elements, canvas, history, and Unsplash
-   **New Contexts** (`src/contexts/`): Elements, Selection, History, and Canvas contexts with improved state management
-   **Multi-Select Fixed** (`src/hooks/useMultiSelect.ts`): Rotation-aware, transform-preserving multi-select
-   **Image Features**: Crop, swap, and Unsplash with fixed pagination
-   **Keyboard Shortcuts**: Undo/Redo (Ctrl/Cmd+Z/Y)
-   **All features architect-reviewed and approved** ✅

**Phase 4 Integration Progress** (Oct 7, 2025):
1. ✅ **Test Page Route Added**: `/test` route now accessible to demo new features
2. ✅ **New Contexts at Root Level**: AppRouter now wraps app with CanvasProvider → ElementsProvider → SelectionProvider → HistoryProvider
3. ✅ **Keyboard Shortcuts Enabled**: Added to Home page (will work once state bridge is complete)
4. ⏳ **Critical Next Step**: Create adapter providers to bridge old `Contexts/*` and new `contexts/*` for state sharing

**Current Architecture State**:
- Old app: Uses `src/Contexts/` (capital C) - AppState, Elements, History
- New features: Use `src/contexts/` (lowercase c) - Elements, Selection, History, Canvas
- **State is NOT synchronized yet** - old and new contexts manage separate state
- Keyboard shortcuts added but operate on isolated new history (no effect until bridge complete)

**What Works**:
- ✅ Test page at `/test` demonstrates all new features working
- ✅ New contexts available throughout app
- ✅ No regressions in existing functionality

**What Needs Completion** (For Next Agent):
1. **CRITICAL**: Create adapter providers that sync old/new contexts (see architect guidance below)
2. Migrate Unsplash integration to use `useUnsplashImages` hook
3. Wire up image crop feature to UI
4. Wire up image swap feature to UI
5. Test and verify all features work together

**Architect Guidance for Adapters**:
> "Implement adapter providers that mirror legacy Contexts/* state into the new contexts (starting with history, elements, and selection) so shared hooks receive real data. Once adapters are in place, verify keyboard shortcuts drive the unified history and remove redundant legacy key handlers when safe."

**Files Modified**:
- `src/Routes/AppRouter.tsx` - Added new context providers at root
- `src/Pages/Home/index.tsx` - Added useKeyboardShortcuts hook

**Files Ready for Integration**:
- ✅ `src/hooks/useUnsplashImages.ts` - Fixed pagination bug
- ✅ `src/components/Dialogs/UnsplashDialog.tsx` - Image selection dialog
- ✅ `src/hooks/useImageCrop.ts` + `src/components/Canvas/CropOverlay.tsx` - Crop functionality
- ✅ `src/hooks/useImageSwap.ts` - Image swapping
- ✅ `src/hooks/useKeyboardShortcuts.ts` - Undo/Redo shortcuts

**Next Agent Start Here**:
1. Read architect guidance in this file and `INTEGRATION_GUIDE.md`
2. Create adapter providers to bridge `Contexts/History` → `contexts/HistoryContext`
3. Create adapter for `Contexts/Elements` → `contexts/ElementsContext`  
4. Test keyboard shortcuts work with bridged state
5. Continue with Unsplash/image feature integration

## External Dependencies

-   **Unsplash API**: Used for image integration (requires `REACT_APP_UNSPLASH_ACCESS_KEY`).
-   **Google Fonts**: Integrated for custom text fonts.
-   **Konva**: A 2d canvas library for desktop and mobile development.
-   **Material-UI (MUI)**: React component library for faster and easier web development.
-   **React Router**: For declarative routing.
-   **react-color**: Color picker component.
-   **uuid**: For generating unique IDs.
-   **use-undo**: For managing undo/redo functionality.