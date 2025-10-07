import React, { useState } from 'react';
import { Box, Button, Stack, Paper, Typography } from '@mui/material';
import { Stage, Layer } from 'react-konva';
import { ElementsProvider } from '../contexts/ElementsContext';
import { SelectionProvider } from '../contexts/SelectionContext';
import { HistoryProvider } from '../contexts/HistoryContext';
import { CanvasProvider } from '../contexts/CanvasContext';
import { TextElementRenderer } from '../components/Elements/TextElement';
import { ImageElementRenderer } from '../components/Elements/ImageElement';
import { ShapeElementRenderer } from '../components/Elements/ShapeElement';
import { UnsplashDialog } from '../components/Dialogs/UnsplashDialog';
import { useElements } from '../contexts/ElementsContext';
import { useSelection } from '../contexts/SelectionContext';
import { useHistory } from '../contexts/HistoryContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { CanvasElement } from '../types';
import styles from './TestPage.module.scss';

const TestPageContent: React.FC = () => {
  const { elements, addElement, updateElement } = useElements();
  const { selectedIds, selectElement, deselectAll } = useSelection();
  const { undo, redo, canUndo, canRedo } = useHistory();
  const [unsplashOpen, setUnsplashOpen] = useState(false);

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  const handleAddText = () => {
    const newElement: Omit<CanvasElement, 'id'> = {
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: elements.length,
      text: 'New Text',
      fontFamily: 'Arial',
      fontSize: 24,
      fontStyle: 'normal',
      fontWeight: 'normal',
      textDecoration: 'none',
      fill: '#000000',
      align: 'left',
      lineHeight: 1.2,
      letterSpacing: 0,
    };
    addElement(newElement);
  };

  const handleAddShape = () => {
    const newElement: Omit<CanvasElement, 'id'> = {
      type: 'shape',
      shapeType: 'rectangle',
      x: 150,
      y: 150,
      width: 150,
      height: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: elements.length,
      fill: '#3498db',
      cornerRadius: 8,
    };
    addElement(newElement);
  };

  const handleSelectImage = (unsplashImage: any) => {
    // Add image element from Unsplash
    const newElement: Omit<CanvasElement, 'id'> = {
      type: 'image',
      x: 200,
      y: 200,
      width: 300,
      height: 200,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: elements.length,
      src: unsplashImage.urls.regular,
    };
    addElement(newElement);
  };

  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedIds.includes(element.id);

    const handleSelect = (e: any) => {
      e.cancelBubble = true;
      selectElement(element.id, e.evt.shiftKey);
    };

    const handleTransformEnd = (e: any) => {
      const node = e.target;
      updateElement(element.id, {
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
      });
    };

    switch (element.type) {
      case 'text':
        return (
          <TextElementRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={handleSelect}
            onTransformEnd={handleTransformEnd}
          />
        );
      case 'image':
        return (
          <ImageElementRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={handleSelect}
            onTransformEnd={handleTransformEnd}
          />
        );
      case 'shape':
        return (
          <ShapeElementRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={handleSelect}
            onTransformEnd={handleTransformEnd}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box className={styles.container}>
      <Paper className={styles.toolbar}>
        <Typography variant="h6">New Architecture Test</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleAddText}>
            Add Text
          </Button>
          <Button variant="contained" onClick={handleAddShape}>
            Add Shape
          </Button>
          <Button
            variant="outlined"
            onClick={() => setUnsplashOpen(true)}
          >
            Add from Unsplash
          </Button>
          <Button
            variant="outlined"
            onClick={undo}
            disabled={!canUndo}
          >
            Undo (Ctrl+Z)
          </Button>
          <Button
            variant="outlined"
            onClick={redo}
            disabled={!canRedo}
          >
            Redo (Ctrl+Y)
          </Button>
        </Stack>
      </Paper>

      <Box className={styles.canvasContainer}>
        <Stage
          width={800}
          height={600}
          onClick={(e) => {
            if (e.target === e.target.getStage()) {
              deselectAll();
            }
          }}
        >
          <Layer>
            {elements.map(renderElement)}
          </Layer>
        </Stage>
      </Box>

      <UnsplashDialog
        open={unsplashOpen}
        onClose={() => setUnsplashOpen(false)}
        onSelectImage={handleSelectImage}
      />
    </Box>
  );
};

export const TestPage: React.FC = () => {
  return (
    <CanvasProvider>
      <HistoryProvider>
        <ElementsProvider>
          <SelectionProvider>
            <TestPageContent />
          </SelectionProvider>
        </ElementsProvider>
      </HistoryProvider>
    </CanvasProvider>
  );
};
