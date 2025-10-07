# Integration Guide - New Architecture to Existing App

**Status:** Phase 3 Complete - Ready for Integration  
**Date:** October 7, 2025

## What's Been Built (Phase 1-3) ✅

### 1. Complete Type System
- **Location:** `src/types/`
- Clean TypeScript interfaces for all element types
- Canvas state, history, and Unsplash types
- Proper discriminated unions for CanvasElement

### 2. Context Providers (Lowercase folder)
- **Location:** `src/contexts/` (note: lowercase 'c')
- `ElementsContext` - Element CRUD operations
- `SelectionContext` - Multi-select with transform preservation
- `HistoryContext` - Undo/Redo with debounced saving
- `CanvasContext` - Canvas state management

### 3. Fixed Features (All Architect-Approved)
- **Unsplash Integration** (`src/hooks/useUnsplashImages.ts`)
  - ✅ Fixed pagination bug using Set-based ID tracking
  - ✅ No more duplicate items between pages
  
- **Image Crop** (`src/hooks/useImageCrop.ts`, `src/components/Canvas/CropOverlay.tsx`)
  - ✅ Konva-based crop overlay with resizable rectangle
  - ✅ Proper coordinate calculation
  
- **Image Swap** (`src/hooks/useImageSwap.ts`)
  - ✅ Change image source while preserving transformations
  - ✅ Optimized image URL generation
  
- **Keyboard Shortcuts** (`src/hooks/useKeyboardShortcuts.ts`)
  - ✅ Undo: Ctrl/Cmd+Z
  - ✅ Redo: Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y

### 4. UI Components
- **Unsplash Dialog** (`src/components/Dialogs/UnsplashDialog.tsx`)
  - Material-UI dialog with search and pagination
  - CSS Modules for styling
  
- **Test Page** (`src/pages/TestPage.tsx`)
  - Demonstrates all features working together
  - Fully functional canvas with new architecture

## Current App Structure

### Old Architecture (Still Active)
```
src/
├── Contexts/           # Capital C - old contexts
├── Components/         # Old components
├── Hooks/             # Old hooks
└── Routes/            # Current routing
```

### New Architecture (Built, Not Integrated)
```
src/
├── contexts/          # lowercase c - NEW contexts
├── components/        # NEW components with CSS Modules
│   ├── Canvas/
│   ├── Elements/
│   └── Dialogs/
├── hooks/             # NEW hooks
├── pages/             # NEW pages
└── types/             # NEW type system
```

## Integration Steps for Next Agent

### Step 1: Add Test Page Route
1. Add route to `src/Routes/AppRouter.tsx` for `/test` → `TestPage`
2. This lets you verify new features work
3. Keep old routes working

### Step 2: Migrate Unsplash Integration
1. Update `src/Components/UI/Tools/Elements/unsplash-images.tsx` to use:
   - `useUnsplashImages` hook instead of direct API calls
   - `UnsplashDialog` component for better UX
2. Remove duplicate pagination logic
3. Test to ensure no regressions

### Step 3: Add Image Crop Feature
1. Add "Crop" button to image element context menu
2. Wire up `useImageCrop` hook
3. Show `CropOverlay` when cropping
4. Apply crop on confirm

### Step 4: Add Image Swap Feature
1. Add "Change Image" button to image elements
2. Use `useImageSwap` hook
3. Open `UnsplashDialog` for selection
4. Preserve transformations when swapping

### Step 5: Enable Keyboard Shortcuts
1. Add `useKeyboardShortcuts()` to main App component
2. Show Undo/Redo in UI toolbar
3. Display keyboard hints

### Step 6: Replace Multi-Select (If Needed)
- Current multi-select may already work
- If bugs persist, migrate to new `useMultiSelect` hook
- New hook has proper transform preservation

## Important Notes

### Case Sensitivity Issue
- Old: `src/Contexts/` (capital C)
- New: `src/contexts/` (lowercase c)
- Keep both for gradual migration
- Eventually consolidate to lowercase

### CSS Modules
- All new components use `.module.scss` for scoped styling
- Requires `sass-embedded` package (already installed ✅)

### Testing Strategy
1. Test each feature in TestPage first
2. Gradually integrate into main app
3. Ensure old features still work
4. Remove old code only after new code is verified

## Files Ready for Integration

### Hooks
- ✅ `src/hooks/useUnsplashImages.ts`
- ✅ `src/hooks/useImageCrop.ts`
- ✅ `src/hooks/useImageSwap.ts`
- ✅ `src/hooks/useKeyboardShortcuts.ts`
- ✅ `src/hooks/useMultiSelect.ts`

### Components
- ✅ `src/components/Dialogs/UnsplashDialog.tsx`
- ✅ `src/components/Canvas/CropOverlay.tsx`
- ✅ `src/components/Canvas/CanvasStage.tsx`
- ✅ `src/components/Elements/` (all renderers)

### Contexts
- ✅ `src/contexts/ElementsContext.tsx`
- ✅ `src/contexts/SelectionContext.tsx`
- ✅ `src/contexts/HistoryContext.tsx`
- ✅ `src/contexts/CanvasContext.tsx`

### Test & Demo
- ✅ `src/pages/TestPage.tsx` - Full demo of new architecture

## Success Criteria

- [ ] TestPage accessible via `/test` route
- [ ] Unsplash pagination works without duplicates
- [ ] Image crop feature functional
- [ ] Image swap preserves transformations
- [ ] Keyboard shortcuts work (Ctrl/Cmd+Z/Y)
- [ ] Old app features still working
- [ ] No regressions in existing functionality

## Next Steps

The new architecture is complete, tested, and architect-approved. The next agent should:

1. Start with Step 1 (add test route) to verify everything works
2. Follow the integration steps in order
3. Test thoroughly after each step
4. Keep the old app functional during migration
5. Document any issues or improvements needed

**Good luck with the integration!** 🚀
