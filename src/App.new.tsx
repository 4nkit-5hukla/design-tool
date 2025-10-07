import React, { useEffect } from 'react';
import { AppProviders, useElements } from './contexts';
import { CanvasStage } from './components/Canvas/CanvasStage';
import './App.css';

const AppContent: React.FC = () => {
  const { addElement } = useElements();

  // Add some test elements
  useEffect(() => {
    // Add a text element
    addElement({
      type: 'text',
      x: 100,
      y: 100,
      width: 300,
      height: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 1,
      text: 'Hello World',
      fontFamily: 'Arial',
      fontSize: 32,
      fontStyle: 'normal',
      fontWeight: 'normal',
      textDecoration: 'none',
      fill: '#000000',
      align: 'left',
      lineHeight: 1.2,
      letterSpacing: 0,
    } as any);

    // Add a rectangle
    addElement({
      type: 'shape',
      shapeType: 'rectangle',
      x: 400,
      y: 100,
      width: 200,
      height: 150,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 2,
      fill: '#3498db',
      cornerRadius: 10,
    } as any);

    // Add a circle
    addElement({
      type: 'shape',
      shapeType: 'circle',
      x: 700,
      y: 200,
      width: 150,
      height: 150,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 3,
      fill: '#e74c3c',
    } as any);
  }, [addElement]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <CanvasStage />
    </div>
  );
};

function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

export default App;
