# Easy Design Tool - Complete Rebuild Plan

**Started:** October 7, 2025  
**Status:** In Progress - Phase 1

## Project Overview
Complete rebuild of the Easy Design Tool (Canva-like design app) with better architecture, focusing on fixing critical issues while maintaining the same UI/UX.

## Critical Issues Being Fixed
1. **Image Crop** - Currently broken, needs proper implementation
2. **Image Swap** - Add ability to change/swap images via Unsplash dialog
3. **Multi-Select** - Complete rebuild:
   - Support mixed element types
   - Preserve transformations on already-transformed elements
   - Build from scratch with solid state management
4. **Unsplash Pagination** - Fix duplicate items (last 3 of page N = first 3 of page N+1)

## Architecture Decisions

### Tech Stack (Preserved)
- React 19 + TypeScript
- Vite 7 (build tool)
- Konva + React-Konva (canvas)
- Material-UI v7 (UI components)
- React Router v7

### New Architecture Improvements
1. **CSS Modules** - All components use `.module.scss` for scoped styling
2. **Better State Management** - Improved context structure to prevent data loss
3. **Transform Preservation** - Multi-select preserves individual element transforms
4. **Type Safety** - Comprehensive TypeScript interfaces throughout

### Folder Structure
```
src/
├── components/          # All UI components with .module.scss
│   ├── Canvas/         # Canvas and stage components
│   ├── Elements/       # Element components (Text, Image, Shape, SVG)
│   ├── Sidebar/        # Sidebar tools
│   ├── Toolbar/        # Top/bottom toolbars
│   └── Dialogs/        # Modal dialogs (Unsplash, etc.)
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── types/              # TypeScript interfaces
├── utils/              # Utility functions
└── styles/             # Global styles
```

## Implementation Phases

### Phase 1: Foundation ✅ Planning
- [x] Create rebuild plan
- [ ] Set up new folder structure
- [ ] Build TypeScript type system
- [ ] Create base contexts

### Phase 2: Core Canvas (Next)
- [ ] Canvas Stage component
- [ ] Basic element rendering
- [ ] Transformer integration

### Phase 3: Multi-Select (Critical)
- [ ] New multi-select hook
- [ ] Transform preservation logic
- [ ] Mixed element type support

### Phase 4: Image Features
- [ ] Image crop functionality
- [ ] Unsplash dialog for image swap
- [ ] Fix pagination bug

### Phase 5: Complete Features
- [ ] Undo/Redo
- [ ] All sidebar tools
- [ ] Export/Save

## Progress Tracking

### ✅ Completed (Phase 1 & 2)
- ✅ Project planning and architecture design
- ✅ TypeScript type system (elements, canvas, history, unsplash)
- ✅ Context providers (Elements, Selection, History, Canvas) with proper state management
- ✅ **Multi-select hook with transform preservation (ARCHITECT REVIEWED & APPROVED)**
  - Correctly handles rotation-aware bounding boxes
  - Uses element centers for transforms (not corners)
  - Works incrementally on current state (no stale data)
  - Supports consecutive operations without data loss
- ✅ Transformer hook for Konva integration
- ✅ Canvas Stage component with CSS Modules
- ✅ Element renderers (Text, Image, Shape, SVG) with filters/shadows support
- ✅ Test app structure created (App.new.tsx)

### 🔄 Phase 3: Integration & Image Features (NEXT STEPS)
1. **Integrate new architecture into existing app**
   - Connect new contexts to main app
   - Replace old canvas with new CanvasStage
   - Wire up new multi-select system
   
2. **Image Crop functionality**
   - Build crop UI component
   - Implement crop logic with Konva
   
3. **Unsplash Dialog & Fixes**
   - Create dialog component for browsing Unsplash images
   - Implement image swapping feature
   - **Fix pagination bug** (last 3 items duplicate between pages)

4. **Undo/Redo Integration**
   - Connect History context to UI
   - Implement keyboard shortcuts
   - Test with all element types

5. **UI Components (Sidebar, Toolbar)**
   - Rebuild with new architecture
   - Use CSS Modules
   - Connect to new contexts

## Key Patterns to Follow

### CSS Modules
```tsx
import styles from './Component.module.scss';

export const Component = () => (
  <div className={styles.container}>...</div>
);
```

### Element State Management
- Each element has unique ID
- Transform data stored separately from element data
- Multi-select creates group transform without modifying individual transforms

### Transform Preservation
```typescript
// Store original transforms before group operation
const originalTransforms = selectedElements.map(el => ({
  id: el.id,
  x: el.x,
  y: el.y,
  rotation: el.rotation,
  scaleX: el.scaleX,
  scaleY: el.scaleY
}));

// Apply group transform
// Restore original transforms relative to new positions
```

## Notes for Future Agents
1. **Do NOT start over** - Continue from where this left off
2. **Check this file first** - It contains the current state and next steps
3. **Update this file** - Document your progress and decisions
4. **Follow the phase plan** - Complete phases in order for stability
5. **Test incrementally** - Verify each feature works before moving on

## Current File Status
- Old implementation: Still in `/src` (will be gradually replaced)
- New implementation: Will be built alongside, then swapped
- Progress tracker: `.local/state/replit/agent/progress_tracker.md`

## Unsplash API Notes
- API Key: `REACT_APP_UNSPLASH_ACCESS_KEY` (check if exists)
- Pagination bug: Page offset calculation needs fixing
- Dialog: Will allow browsing and swapping images

## Multi-Select Implementation Strategy
1. Track selected element IDs separately
2. Calculate bounding box of selection
3. Apply transforms to group
4. When moving group, adjust each element's position proportionally
5. When scaling group, scale each element relative to group center
6. Preserve individual rotations and other properties

---
*Last Updated: October 7, 2025 - Initial planning complete*
