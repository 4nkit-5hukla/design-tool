# Easy Design Tool

## Overview
Easy Design Tool is a web-based graphic design application, similar to Canva, built with React, TypeScript, and Konva. It offers a user-friendly interface for creating designs using images, text, shapes, and SVG elements. The project's ambition is to provide a comprehensive and intuitive design experience.

## User Preferences
None configured yet.

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

## External Dependencies

-   **Unsplash API**: Used for image integration (requires `REACT_APP_UNSPLASH_ACCESS_KEY`).
-   **Google Fonts**: Integrated for custom text fonts.
-   **Konva**: A 2d canvas library for desktop and mobile development.
-   **Material-UI (MUI)**: React component library for faster and easier web development.
-   **React Router**: For declarative routing.
-   **react-color**: Color picker component.
-   **uuid**: For generating unique IDs.
-   **use-undo**: For managing undo/redo functionality.