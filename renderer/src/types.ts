export type Tool = "pen" | "pencil" | "highlighter" | "eraser" | "text" | "fill" | "select";
export interface Stroke {
  id: string;
  tool: Tool;
  points: number[];
  stroke: string;
  strokeWidth: number;
  tension?: number;
  globalCompositeOperation?: string;
}
export interface TextNode {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fill: string;
}
export interface ImageNode {
  id: string;
  src: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}
export interface NoteProj {
  strokes: Stroke[];
  texts: TextNode[];
  images: ImageNode[];
  meta?: { title?: string; created?: string };
}
