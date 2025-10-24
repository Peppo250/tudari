import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Text as KText, Image as KImage, Rect, Circle, Arrow } from "react-konva";
import useImage from "use-image";
import { v4 as uuid } from "uuid";
import { Tool, Stroke, TextNode, ImageNode, NoteProj } from "../types";

// simple image wrapper for Konva
const UploadedImage: React.FC<{ node: ImageNode }> = ({ node }) => {
  const [img] = useImage(node.src);
  return <KImage image={img} x={node.x} y={node.y} width={node.width} height={node.height} draggable />;
};

type Props = { externalTool: Tool };

export default function DrawingCanvas({ externalTool }: Props) {
  const stageRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const [tool, setTool] = useState<Tool>(externalTool || "pen");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [texts, setTexts] = useState<TextNode[]>([]);
  const [images, setImages] = useState<ImageNode[]>([]);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const isDrawing = useRef(false);

  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState<NoteProj[]>([]);
  const [redoStack, setRedoStack] = useState<NoteProj[]>([]);

  // Grid, viewport & zoom
  const [gridSize] = useState(24);
  const [stageSize, setStageSize] = useState({ width: window.innerWidth - 260, height: window.innerHeight });
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(1);

  useEffect(() => {
    setTool(externalTool);
  }, [externalTool]);

  // Handle spacebar for pan mode and zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!stageRef.current) return;

      const stage = stageRef.current;
      const pointer = stage.getPointerPosition();
      const scaleBy = 1.05;
      const oldScale = stage.scaleX();
      const newScale = e.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

      // Limit zoom levels
      const clampedScale = Math.max(0.1, Math.min(5, newScale));
      
      setStageScale(clampedScale);
      
      // Zoom towards cursor position
      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };
      
      const newPos = {
        x: pointer.x - mousePointTo.x * clampedScale,
        y: pointer.y - mousePointTo.y * clampedScale,
      };
      
      setStagePos(newPos);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    // wire up color & brush controls
    const uploader = document.getElementById("image-uploader") as HTMLInputElement | null;
    if (uploader) {
      uploader.onchange = (e) => {
        const f = (e.target as HTMLInputElement).files?.[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => {
          const src = String(r.result);
          const node: ImageNode = { id: uuid(), src, x: 60, y: 60, width: 300, height: 200 };
          pushStateToUndo();
          setImages((s) => [...s, node]);
        };
        r.readAsDataURL(f);
      };
    }

    // listen to export events
    const exportPNG = () => {
      if (!stageRef.current) return;
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
      const a = document.createElement("a");
      a.href = dataURL;
      a.download = "tudari_note.png";
      a.click();
    };
    const exportNoteProj = () => {
      const proj: NoteProj = { strokes, texts, images, meta: { created: new Date().toISOString() } };
      const blob = new Blob([JSON.stringify(proj, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "noteproj.json";
      a.click();
    };

    window.addEventListener("exportPNG", exportPNG as EventListener);
    window.addEventListener("exportNoteProj", exportNoteProj as EventListener);

    return () => {
      window.removeEventListener("exportPNG", exportPNG as EventListener);
      window.removeEventListener("exportNoteProj", exportNoteProj as EventListener);
    };
  }, [strokes, texts, images]);

  // Save snapshot to undo stack
  const pushStateToUndo = () => {
    setUndoStack((s) => [...s, { strokes: JSON.parse(JSON.stringify(strokes)), texts: JSON.parse(JSON.stringify(texts)), images: JSON.parse(JSON.stringify(images)) }]);
    setRedoStack([]);
  };

  const undo = () => {
    const last = undoStack[undoStack.length - 1];
    if (!last) return;
    setRedoStack((r) => [...r, { strokes: JSON.parse(JSON.stringify(strokes)), texts: JSON.parse(JSON.stringify(texts)), images: JSON.parse(JSON.stringify(images)) }]);
    setStrokes(last.strokes);
    setTexts(last.texts);
    setImages(last.images);
    setUndoStack((s) => s.slice(0, -1));
  };

  const redo = () => {
    const last = redoStack[redoStack.length - 1];
    if (!last) return;
    setUndoStack((u) => [...u, { strokes: JSON.parse(JSON.stringify(strokes)), texts: JSON.parse(JSON.stringify(texts)), images: JSON.parse(JSON.stringify(images)) }]);
    setStrokes(last.strokes);
    setTexts(last.texts);
    setImages(last.images);
    setRedoStack((s) => s.slice(0, -1));
  };

  // Get cursor style based on current state
  const getCursor = () => {
    if (isSpacePressed && isPanning) return "grabbing";
    if (isSpacePressed) return "grab";
    if (tool === "text") return "text";
    if (tool === "eraser") return "crosshair";
    return "crosshair";
  };

  // Create vector shapes based on tool
  const createVectorShape = (points: number[], tool: Tool, color: string, brush: number) => {
    if (points.length < 4) return null;
    return null;
  };

  const handleMouseDown = (e: any) => {
    if (isSpacePressed) {
      setIsPanning(true);
      return;
    }

    if (tool === "text") {
      const stage = stageRef.current.getStage();
      const p = stage.getPointerPosition();
      const transform = stage.getAbsoluteTransform().copy().invert();
      const localPos = transform.point(p);
      
      const txt = prompt("Enter text:");
      if (txt) {
        pushStateToUndo();
        setTexts((t) => [...t, { 
          id: uuid(), 
          x: localPos.x, 
          y: localPos.y, 
          text: txt, 
          fontSize: 18, 
          fill: (document.getElementById("color-picker") as HTMLInputElement)?.value || "#000000"
        }]);
      }
      return;
    }

    if (tool === "fill") {
      pushStateToUndo();
      const color = (document.getElementById("color-picker") as HTMLInputElement)?.value || "#000000";
      const backRectStroke: Stroke = {
        id: uuid(),
        tool: "pen",
        points: [-10000, -10000, 10000, -10000, 10000, 10000, -10000, 10000],
        stroke: color,
        strokeWidth: 0,
        globalCompositeOperation: "destination-over",
      };
      setStrokes((s) => [backRectStroke, ...s]);
      return;
    }

    const stage = stageRef.current.getStage();
    const pos = stage.getPointerPosition();
    const transform = stage.getAbsoluteTransform().copy().invert();
    const localPos = transform.point(pos);

    if (["pen", "pencil", "eraser", "highlighter", "rectangle", "circle", "arrow"].includes(tool)) {
      isDrawing.current = true;
      pushStateToUndo();
      const color = (document.getElementById("color-picker") as HTMLInputElement)?.value || "#000000";
      const brush = Number((document.getElementById("brush") as HTMLInputElement)?.value || 2);
      
      const stroke: Stroke = {
        id: uuid(),
        tool,
        points: [localPos.x, localPos.y],
        stroke: tool === "eraser" ? "rgba(0,0,0,1)" : color,
        strokeWidth: tool === "highlighter" ? Math.max(brush, 12) : brush,
        tension: tool === "pencil" ? 0 : 0.5,
        globalCompositeOperation: tool === "eraser" ? "destination-out" : "source-over",
      };
      setCurrentStroke(stroke);
      setStrokes((s) => [...s, stroke]);
    }
  };

  const handleMouseMove = (e: any) => {
    if (isPanning && isSpacePressed) return;
    if (!isDrawing.current || !currentStroke) return;
    
    const stage = stageRef.current.getStage();
    const point = stage.getPointerPosition();
    const transform = stage.getAbsoluteTransform().copy().invert();
    const localPoint = transform.point(point);

    if (["rectangle", "circle", "arrow"].includes(currentStroke.tool)) {
      // For shapes, only keep start and current point
      currentStroke.points = [currentStroke.points[0], currentStroke.points[1], localPoint.x, localPoint.y];
    } else {
      // For free drawing, add all points
      currentStroke.points = currentStroke.points.concat([localPoint.x, localPoint.y]);
    }
    
    setStrokes((s) => {
      const copy = [...s];
      copy[copy.length - 1] = { ...currentStroke };
      return copy;
    });
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }
    
    isDrawing.current = false;
    setCurrentStroke(null);
  };

  const handleStageDragEnd = (e: any) => {
    setStagePos({ x: e.target.x(), y: e.target.y() });
  };

  // Render vector shapes
  const renderShape = (stroke: Stroke) => {
    if (["rectangle", "circle", "arrow"].includes(stroke.tool) && stroke.points.length >= 4) {
      const color = stroke.stroke;
      const strokeWidth = stroke.strokeWidth;
    }

    // Default line rendering for free drawing
    return (
      <Line
        key={stroke.id}
        points={stroke.points}
        stroke={stroke.stroke}
        strokeWidth={stroke.strokeWidth}
        tension={stroke.tension}
        lineCap="round"
        globalCompositeOperation={stroke.globalCompositeOperation as any}
      />
    );
  };

  // grid drawing helper
  const renderGrid = () => {
    const gridBounds = {
      left: -stagePos.x / stageScale - 1000,
      top: -stagePos.y / stageScale - 1000,
      right: (-stagePos.x + stageSize.width) / stageScale + 1000,
      bottom: (-stagePos.y + stageSize.height) / stageScale + 1000,
    };

    const startCol = Math.floor(gridBounds.left / gridSize);
    const endCol = Math.ceil(gridBounds.right / gridSize);
    const startRow = Math.floor(gridBounds.top / gridSize);
    const endRow = Math.ceil(gridBounds.bottom / gridSize);

    const lines = [];
    
    for (let i = startCol; i <= endCol; i++) {
      lines.push(
        <Line 
          key={`v-${i}`} 
          points={[i * gridSize, gridBounds.top, i * gridSize, gridBounds.bottom]} 
          stroke="#eee" 
          strokeWidth={0.5 / stageScale} 
        />
      );
    }
    
    for (let j = startRow; j <= endRow; j++) {
      lines.push(
        <Line 
          key={`h-${j}`} 
          points={[gridBounds.left, j * gridSize, gridBounds.right, j * gridSize]} 
          stroke="#eee" 
          strokeWidth={0.5 / stageScale} 
        />
      );
    }
    
    return lines;
  };

  // handle window resize
  useEffect(() => {
    const onResize = () => {
      setStageSize({ width: window.innerWidth - 260, height: window.innerHeight });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div>
      <div style={{ position: "absolute", right: 16, top: 8, zIndex: 10, display: "flex", gap: 6 }}>
        <button className="button small" onClick={undo}>Undo</button>
        <button className="button small" onClick={redo}>Redo</button>
        <span style={{ color: "#666", fontSize: "12px", alignSelf: "center" }}>
          {isSpacePressed && "Pan Mode"} Zoom: {Math.round(stageScale * 100)}%
        </span>
      </div>

      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragEnd={handleStageDragEnd}
        ref={stageRef}
        style={{ background: "#fff", cursor: getCursor() }}
        draggable={isSpacePressed}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
      >
        <Layer ref={layerRef}>
          {/* grid */}
          {renderGrid()}

          {/* strokes - now as vector shapes */}
          {strokes.map(renderShape)}

          {/* texts */}
          {texts.map((t) => (
            <KText key={t.id} text={t.text} x={t.x} y={t.y} fontSize={t.fontSize} fill={t.fill} draggable />
          ))}

          {/* images */}
          {images.map((img) => (
            <UploadedImage key={img.id} node={img} />
          ))}

        </Layer>
      </Stage>
    </div>
  );
}