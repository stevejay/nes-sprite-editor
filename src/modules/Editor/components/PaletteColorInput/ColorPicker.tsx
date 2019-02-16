import * as React from "react";
import TileCanvas from "../../../../shared/TileCanvas";
import useSizedCanvasEffect from "../../../../shared/utils/use-sized-canvas-effect";
import { Color, SystemPalette } from "../../store";
import styles from "./ColorPicker.module.scss";

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
  useSizedCanvasEffect(canvasRef, COLUMNS, ROWS, scale);

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
    <TileCanvas.Container className={styles.container}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        role="img"
        aria-label="todo"
      />
      <TileCanvas.InteractionTracker
        rows={ROWS}
        columns={COLUMNS}
        row={currentRow}
        column={currentColumn}
        onSelect={handleSelect}
      >
        <TileCanvas.Highlight
          tileWidth={scale}
          tileHeight={scale}
          row={currentRow}
          column={currentColumn}
          aria-label="todo"
        />
      </TileCanvas.InteractionTracker>
    </TileCanvas.Container>
  );
};

export default ColorPicker;
