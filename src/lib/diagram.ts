/**
 * A tiny layout engine for the architecture diagrams (docs/brief.md, section 9).
 * A diagram is a set of boxes on a grid plus edges between them. Each layout is
 * drawn at its natural size (one SVG unit per CSS pixel) and only ever scales down,
 * so labels stay at --step-small whenever there is room.
 */

export type Route = 'auto' | 'hv' | 'vh' | 'loop-right';

export interface NodeSpec {
  id: string;
  label: string[];
  col: number;
  row: number;
}

export interface EdgeSpec {
  from: string;
  to: string;
  route?: Route;
  /** A short note drawn beside the edge. */
  note?: string[];
  noteSide?: 'above' | 'below' | 'right';
}

export interface NoteSpec {
  lines: string[];
  /** Grid position of the note's top-left corner and how many columns it spans. */
  col: number;
  row: number;
  span?: number;
}

export interface LayoutSpec {
  columns: number;
  rows: number;
  boxWidth: number;
  boxHeight: number;
  /** One gap for all columns, or one per gap. */
  gapX: number | number[];
  gapY: number | number[];
  nodes: NodeSpec[];
  edges: EdgeSpec[];
  notes?: NoteSpec[];
  /** Short description of what this particular layout shows. */
  description: string;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

export interface DrawnText {
  x: number;
  y: number;
  lines: string[];
  anchor: 'start' | 'middle';
}

export interface DrawnLayout {
  width: number;
  height: number;
  viewBox: string;
  boxes: Array<Box & { id: string; text: DrawnText }>;
  edges: Array<{ d: string; note?: DrawnText }>;
  notes: Array<{ x: number; y: number; w: number; h: number; text: DrawnText }>;
  description: string;
}

const PADDING = 12;
const LINE_HEIGHT = 18;
const NOTE_LINE_HEIGHT = 17;
const NOTE_HEIGHT = 36;
/** Rough advance of the label font, used only to size the canvas around notes. */
const NOTE_CHAR_WIDTH = 7.2;

function offsets(count: number, size: number, gap: number | number[]): number[] {
  const gaps = Array.isArray(gap) ? gap : Array.from({ length: Math.max(0, count - 1) }, () => gap);
  const starts: number[] = [0];
  for (let index = 1; index < count; index += 1) {
    starts.push(starts[index - 1]! + size + (gaps[index - 1] ?? 0));
  }
  return starts;
}

/** Position of a (possibly fractional) grid index. */
function at(starts: number[], index: number): number {
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const a = starts[lower] ?? 0;
  const b = starts[upper] ?? a;
  return a + (b - a) * (index - lower);
}

function labelText(cx: number, cy: number, lines: string[]): DrawnText {
  // Centre the block of lines on the box; 5 is roughly 0.35em of a 14px label.
  const first = cy - ((lines.length - 1) * LINE_HEIGHT) / 2 + 5;
  return { x: cx, y: first, lines, anchor: 'middle' };
}

function edgePath(from: Box, to: Box, route: Route): { d: string; points: Array<[number, number]> } {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  let points: Array<[number, number]>;

  if (route === 'loop-right') {
    const x = Math.max(from.x + from.w, to.x + to.w) + 20;
    points = [
      [from.x + from.w, from.cy],
      [x, from.cy],
      [x, to.cy],
      [to.x + to.w, to.cy],
    ];
  } else if (route === 'hv') {
    const startX = dx > 0 ? from.x + from.w : from.x;
    const endY = dy > 0 ? to.y : to.y + to.h;
    points = [
      [startX, from.cy],
      [to.cx, from.cy],
      [to.cx, endY],
    ];
  } else if (route === 'vh') {
    const startY = dy > 0 ? from.y + from.h : from.y;
    const endX = dx > 0 ? to.x : to.x + to.w;
    points = [
      [from.cx, startY],
      [from.cx, to.cy],
      [endX, to.cy],
    ];
  } else if (Math.abs(dy) < 1) {
    points = dx > 0 ? [[from.x + from.w, from.cy], [to.x, to.cy]] : [[from.x, from.cy], [to.x + to.w, to.cy]];
  } else if (Math.abs(dx) < 1) {
    points = dy > 0 ? [[from.cx, from.y + from.h], [to.cx, to.y]] : [[from.cx, from.y], [to.cx, to.y + to.h]];
  } else if (Math.abs(dx) >= Math.abs(dy)) {
    // Horizontal, vertical, horizontal.
    const startX = dx > 0 ? from.x + from.w : from.x;
    const endX = dx > 0 ? to.x : to.x + to.w;
    const midX = (startX + endX) / 2;
    points = [
      [startX, from.cy],
      [midX, from.cy],
      [midX, to.cy],
      [endX, to.cy],
    ];
  } else {
    // Vertical, horizontal, vertical.
    const startY = dy > 0 ? from.y + from.h : from.y;
    const endY = dy > 0 ? to.y : to.y + to.h;
    const midY = (startY + endY) / 2;
    points = [
      [from.cx, startY],
      [from.cx, midY],
      [to.cx, midY],
      [to.cx, endY],
    ];
  }

  const d = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${round(x)} ${round(y)}`).join(' ');
  return { d, points };
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

function edgeNote(points: Array<[number, number]>, lines: string[], side: EdgeSpec['noteSide']): DrawnText {
  // Attach the note to the longest segment of the edge.
  let best = 0;
  let length = -1;
  for (let index = 0; index < points.length - 1; index += 1) {
    const [x1, y1] = points[index]!;
    const [x2, y2] = points[index + 1]!;
    const segment = Math.hypot(x2 - x1, y2 - y1);
    if (segment > length) {
      length = segment;
      best = index;
    }
  }
  const [x1, y1] = points[best]!;
  const [x2, y2] = points[best + 1]!;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const block = (lines.length - 1) * NOTE_LINE_HEIGHT;
  if (side === 'right') return { x: mx + 12, y: my - block / 2 + 4, lines, anchor: 'start' };
  if (side === 'above') return { x: mx, y: my - 10 - block, lines, anchor: 'middle' };
  return { x: mx, y: my + 20, lines, anchor: 'middle' };
}

export function layoutDiagram(spec: LayoutSpec): DrawnLayout {
  const xs = offsets(spec.columns, spec.boxWidth, spec.gapX);
  const ys = offsets(spec.rows, spec.boxHeight, spec.gapY);
  const boxes = new Map<string, Box>();

  const drawnBoxes = spec.nodes.map((node) => {
    const x = PADDING + at(xs, node.col);
    const y = PADDING + at(ys, node.row);
    const box: Box = {
      x,
      y,
      w: spec.boxWidth,
      h: spec.boxHeight,
      cx: x + spec.boxWidth / 2,
      cy: y + spec.boxHeight / 2,
    };
    boxes.set(node.id, box);
    return { ...box, id: node.id, text: labelText(box.cx, box.cy, node.label) };
  });

  let maxX = Math.max(...drawnBoxes.map((box) => box.x + box.w));
  let maxY = Math.max(...drawnBoxes.map((box) => box.y + box.h));

  const edges = spec.edges.map((edge) => {
    const from = boxes.get(edge.from);
    const to = boxes.get(edge.to);
    if (!from || !to) throw new Error(`Diagram edge ${edge.from} to ${edge.to} references a missing node.`);
    const { d, points } = edgePath(from, to, edge.route ?? 'auto');
    for (const [x, y] of points) {
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
    const note = edge.note ? edgeNote(points, edge.note, edge.noteSide) : undefined;
    if (note) {
      const widest = Math.max(...note.lines.map((line) => line.length)) * NOTE_CHAR_WIDTH;
      maxX = Math.max(maxX, note.anchor === 'start' ? note.x + widest : note.x + widest / 2);
      maxY = Math.max(maxY, note.y + (note.lines.length - 1) * NOTE_LINE_HEIGHT + 6);
    }
    return { d, note };
  });

  const notes = (spec.notes ?? []).map((item) => {
    const x = PADDING + at(xs, item.col);
    const y = PADDING + at(ys, item.row);
    const span = item.span ?? 1;
    const w = at(xs, item.col + span - 1) + spec.boxWidth - at(xs, item.col);
    const h = NOTE_HEIGHT + (item.lines.length - 1) * NOTE_LINE_HEIGHT;
    maxX = Math.max(maxX, x + w);
    maxY = Math.max(maxY, y + h);
    const text: DrawnText = { x: x + 12, y: y + 22, lines: item.lines, anchor: 'start' };
    return { x, y, w, h, text };
  });

  const width = Math.ceil(maxX + PADDING);
  const height = Math.ceil(maxY + PADDING);
  return {
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    boxes: drawnBoxes,
    edges,
    notes,
    description: spec.description,
  };
}
