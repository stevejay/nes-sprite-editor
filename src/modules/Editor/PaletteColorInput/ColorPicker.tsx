import * as React from "react";
import styles from "./ColorPicker.module.scss";
import { SystemPalette, Color } from "../../../model";
import useSizedCanvasEffect from "../../../shared/utils/use-sized-canvas-effect";
import TileCanvas from "../../../shared/TileCanvas";

const COLUMNS = 16;
const ROWS = 64 / COLUMNS;

type Props = {
  palette: SystemPalette;
  selectedColorId: Color["id"];
  scale: number;
  onChange: (color: Color) => void;
  children?: never;
};

const ColorPicker = ({ palette, selectedColorId, scale, onChange }: Props) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasSize = useSizedCanvasEffect(canvasRef, COLUMNS, ROWS, scale);

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    palette.values.forEach((color, index) => {
      const x = (index % COLUMNS) * scale;
      const y = Math.floor(index / COLUMNS) * scale;
      if (!color.available) {
        return;
      }
      ctx.fillStyle = color.rgb;
      ctx.fillRect(x, y, scale, scale);
    });
  }, [palette, scale]);

  const handleSelect = (row: number, column: number) => {
    const index = row * COLUMNS + column;
    const color = palette.values[index];
    if (color.available) {
      onChange(color);
    }
  };

  const currentRow = Math.floor(selectedColorId / COLUMNS);
  const currentColumn = selectedColorId % COLUMNS;

  return (
    <TileCanvas.InteractionTracker
      rows={ROWS}
      columns={COLUMNS}
      row={currentRow}
      column={currentColumn}
      onSelect={handleSelect}
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={canvasSize}
        role="img"
        aria-label="Todo"
      />
      <TileCanvas.Highlight
        tileWidth={scale}
        tileHeight={scale}
        row={currentRow}
        column={currentColumn}
        ariaLabel="todo"
      />
    </TileCanvas.InteractionTracker>
  );
};

export default ColorPicker;
