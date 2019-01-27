import * as React from "react";
import { host } from "storybook-host";
// import { withKnobs, boolean } from "@storybook/addon-knobs";
import { State, Store } from "@sambego/storybook-state";
import { storiesOf } from "@storybook/react";
import "../../../index.scss";
import ColorPicker from "../ColorPicker";
import { SYSTEM_PALETTE_OPTIONS } from "../../../constants";
import styles from "./ColorPicker.stories.module.scss";
import { SystemPalette, ColorId, Color } from "../../../types";
import useSizedCanvasEffect from "../../utils/use-sized-canvas-effect";
import { TileInteractionTracker, SelectedTile } from "../../TileCanvas";

const storyHost = host({
  align: "center middle",
  backdrop: "transparent"
});

const store = new Store({
  colorId: 0
});

const CROSS_OFFSET = 4;
const COLUMNS = 16;
const ROWS = 64 / COLUMNS;

type Props = {
  palette: SystemPalette;
  selectedColorId: ColorId;
  scaling: number;
  onChange: (color: Color) => void;
};

const NewColorPicker: React.FunctionComponent<Props> = ({
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

  React.useLayoutEffect(
    () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      palette.values.forEach((color, index) => {
        const x = (index % COLUMNS) * scaling;
        const y = Math.floor(index / COLUMNS) * scaling;
        const rgbString = color.available ? color.rgb : "#eee";
        ctx.fillStyle = rgbString;
        ctx.fillRect(x, y, scaling, scaling);
        if (!color.available) {
          ctx.strokeStyle = "#000";
          ctx.lineCap = "round";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + CROSS_OFFSET, y + CROSS_OFFSET);
          ctx.lineTo(x + scaling - CROSS_OFFSET, y + scaling - CROSS_OFFSET);
          ctx.moveTo(x + CROSS_OFFSET, y + scaling - CROSS_OFFSET);
          ctx.lineTo(x + scaling - CROSS_OFFSET, y + CROSS_OFFSET);
          ctx.stroke();
        }
      });
    },
    [palette, scaling]
  );

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
    <TileInteractionTracker
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
      <SelectedTile
        tileWidth={scaling}
        tileHeight={scaling}
        row={currentRow}
        column={currentColumn}
        ariaLabel="todo"
      />
    </TileInteractionTracker>
  );
};

storiesOf("PaletteColorInput/ColorPicker", module)
  .addDecorator(storyHost)
  // .addDecorator(withKnobs)
  .add("Basic", () => (
    <State store={store}>
      {state => (
        <NewColorPicker
          palette={SYSTEM_PALETTE_OPTIONS[0]}
          selectedColorId={state.colorId}
          scaling={24}
          onChange={color => store.set({ colorId: color.id })}
        />
      )}
    </State>
  ));
