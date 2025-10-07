import { useEffect } from 'react';
import { useHistory } from '../contexts/adapters/HistoryAdapter';

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
}

/**
 * Hook for keyboard shortcuts
 * Handles undo (Ctrl/Cmd+Z) and redo (Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y)
 */
export const useKeyboardShortcuts = (options: UseKeyboardShortcutsOptions = {}) => {
  const { enabled = true } = options;
  const { undo, redo, canUndo, canRedo } = useHistory();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl (Windows/Linux) or Cmd (Mac)
      const isModifier = e.ctrlKey || e.metaKey;
      
      if (!isModifier) return;

      // Undo: Ctrl/Cmd + Z (without shift)
      if (e.key === 'z' && !e.shiftKey && canUndo) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if (((e.key === 'z' && e.shiftKey) || e.key === 'y') && canRedo) {
        e.preventDefault();
        redo();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, undo, redo, canUndo, canRedo]);
};
