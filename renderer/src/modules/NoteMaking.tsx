import React, { useState } from "react";
import DrawingCanvas from "../components/DrawingCanvas";
import { Tool } from "../types";

export default function NoteMaking() {
  const [tool, setTool] = useState<Tool>("pen");
  return (
    <div className="app">
      <div className="sidebar">
        <h3>Tudari — Notes</h3>

        <div className="toolbar-row">
          <button className="button" onClick={() => setTool("pen")}>Pen</button>
          <button className="button" onClick={() => setTool("pencil")}>Pencil</button>
          <button className="button" onClick={() => setTool("highlighter")}>Highlighter</button>
          <button className="button" onClick={() => setTool("eraser")}>Eraser</button>
          <button className="button" onClick={() => setTool("text")}>Text</button>
          <button className="button" onClick={() => setTool("fill")}>Fill</button>
        </div>

        <div style={{ marginTop: 8 }}>
          <label className="small">Color</label>
          <input id="color-picker" type="color" defaultValue="#000000" />
        </div>

        <div style={{ marginTop: 8 }}>
          <label className="small">Brush size</label>
          <input id="brush" type="range" min={1} max={30} defaultValue={2} />
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="button primary" onClick={() => {
            // dispatch custom event to DrawingCanvas
            window.dispatchEvent(new CustomEvent("exportPNG"));
          }}>Export PNG</button>
          <button className="button" style={{ marginLeft: 8 }} onClick={() => window.dispatchEvent(new CustomEvent("exportNoteProj"))}>Save .noteproj</button>
          <input id="image-uploader" type="file" accept="image/*" style={{ marginTop: 8 }} />
        </div>

      </div>

      <div className="canvas-area">
        <DrawingCanvas externalTool={tool} />
      </div>
    </div>
  );
}
