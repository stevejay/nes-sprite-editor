import * as React from "react";
import styles from "./ColorPicker.module.scss";
import { SystemPalette, Color } from "../../types";
import useSizedCanvasEffect from "../utils/use-sized-canvas-effect";
import TileCanvas from "../TileCanvas";

const COLUMNS = 16;
const ROWS = 64 / COLUMNS;

type Props = {
  palette: SystemPalette;
  selectedColorId: Color["id"];
  scaling: number;
  onChange: (color: Color) => void;
  children?: never;
};

const ColorPicker: React.FunctionComponent<Props> = ({
  palette,
  selectedColorId,
  scaling,
  onChange
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasSize = useSizedCanvasEffect(
    canvasRef,
    ROWS,
    COLUMNS,
    scaling,
    scaling
  );

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    palette.values.forEach((color, index) => {
      const x = (index % COLUMNS) * scaling;
      const y = Math.floor(index / COLUMNS) * scaling;
      if (!color.available) {
        return;
      }
      ctx.fillStyle = color.rgb;
      ctx.fillRect(x, y, scaling, scaling);
    });
  }, [palette, scaling]);

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
        tileWidth={scaling}
        tileHeight={scaling}
        row={currentRow}
        column={currentColumn}
        ariaLabel="todo"
      />
    </TileCanvas.InteractionTracker>
  );
};

export default ColorPicker;
