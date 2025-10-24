import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NoteMaking from './NoteMaking';

// Mock DrawingCanvas component
jest.mock('../components/DrawingCanvas', () => {
  return function MockDrawingCanvas({ externalTool }: { externalTool: string }) {
    return <div data-testid="drawing-canvas" data-tool={externalTool}>Canvas</div>;
  };
});

describe('NoteMaking', () => {
  // Tool selection tests
  test('should change tool to pen when pen button clicked', () => {
    render(<NoteMaking />);
    
    fireEvent.click(screen.getByText('Pen'));
    
    expect(screen.getByTestId('drawing-canvas')).toHaveAttribute('data-tool', 'pen');
  });

  test('should change tool to pencil when pencil button clicked', () => {
    render(<NoteMaking />);
    
    fireEvent.click(screen.getByText('Pencil'));
    
    expect(screen.getByTestId('drawing-canvas')).toHaveAttribute('data-tool', 'pencil');
  });

  test('should change tool to highlighter when highlighter button clicked', () => {
    render(<NoteMaking />);
    
    fireEvent.click(screen.getByText('Highlighter'));
    
    expect(screen.getByTestId('drawing-canvas')).toHaveAttribute('data-tool', 'highlighter');
  });

  test('should change tool to eraser when eraser button clicked', () => {
    render(<NoteMaking />);
    
    fireEvent.click(screen.getByText('Eraser'));
    
    expect(screen.getByTestId('drawing-canvas')).toHaveAttribute('data-tool', 'eraser');
  });

  test('should change tool to text when text button clicked', () => {
    render(<NoteMaking />);
    
    fireEvent.click(screen.getByText('Text'));
    
    expect(screen.getByTestId('drawing-canvas')).toHaveAttribute('data-tool', 'text');
  });

  test('should change tool to fill when fill button clicked', () => {
    render(<NoteMaking />);
    
    fireEvent.click(screen.getByText('Fill'));
    
    expect(screen.getByTestId('drawing-canvas')).toHaveAttribute('data-tool', 'fill');
  });

  // Default state
  test('should default to pen tool', () => {
    render(<NoteMaking />);
    
    expect(screen.getByTestId('drawing-canvas')).toHaveAttribute('data-tool', 'pen');
  });

  // UI elements
  test('should display all toolbar buttons', () => {
    render(<NoteMaking />);
    
    expect(screen.getByText('Pen')).toBeInTheDocument();
    expect(screen.getByText('Pencil')).toBeInTheDocument();
    expect(screen.getByText('Highlighter')).toBeInTheDocument();
    expect(screen.getByText('Eraser')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Fill')).toBeInTheDocument();
  });

  test('should display color picker with default black', () => {
    render(<NoteMaking />);
    
    const colorPicker = screen.getByLabelText('Color');
    expect(colorPicker).toBeInTheDocument();
    expect(colorPicker).toHaveAttribute('type', 'color');
    expect(colorPicker).toHaveAttribute('defaultValue', '#000000');
  });

  test('should display brush size slider with correct range', () => {
    render(<NoteMaking />);
    
    const brushSlider = screen.getByLabelText('Brush size');
    expect(brushSlider).toBeInTheDocument();
    expect(brushSlider).toHaveAttribute('type', 'range');
    expect(brushSlider).toHaveAttribute('min', '1');
    expect(brushSlider).toHaveAttribute('max', '30');
    expect(brushSlider).toHaveAttribute('defaultValue', '2');
  });

  test('should display export and save buttons', () => {
    render(<NoteMaking />);
    
    expect(screen.getByText('Export PNG')).toBeInTheDocument();
    expect(screen.getByText('Save .noteproj')).toBeInTheDocument();
  });

  test('should display file uploader', () => {
    render(<NoteMaking />);
    
    const fileUploader = screen.getByRole('button', { name: /choose file/i }) || 
                        document.querySelector('#image-uploader');
    expect(fileUploader).toBeInTheDocument();
    expect(fileUploader).toHaveAttribute('accept', 'image/*');
  });

  // Event dispatching tests
  test('should dispatch exportPNG event when Export PNG clicked', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<NoteMaking />);
    
    fireEvent.click(screen.getByText('Export PNG'));
    
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'exportPNG'
      })
    );
    
    dispatchSpy.mockRestore();
  });

  test('should dispatch exportNoteProj event when Save button clicked', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    render(<NoteMaking />);
    
    fireEvent.click(screen.getByText('Save .noteproj'));
    
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'exportNoteProj'
      })
    );
    
    dispatchSpy.mockRestore();
  });

  // Component structure
  test('should render title', () => {
    render(<NoteMaking />);
    
    expect(screen.getByText('Tudari — Notes')).toBeInTheDocument();
  });

  test('should render drawing canvas', () => {
    render(<NoteMaking />);
    
    expect(screen.getByTestId('drawing-canvas')).toBeInTheDocument();
  });

  // Tool switching sequence
  test('should switch between multiple tools correctly', () => {
    render(<NoteMaking />);
    
    const canvas = screen.getByTestId('drawing-canvas');
    
    fireEvent.click(screen.getByText('Highlighter'));
    expect(canvas).toHaveAttribute('data-tool', 'highlighter');
    
    fireEvent.click(screen.getByText('Eraser'));
    expect(canvas).toHaveAttribute('data-tool', 'eraser');
    
    fireEvent.click(screen.getByText('Text'));
    expect(canvas).toHaveAttribute('data-tool', 'text');
  });
});