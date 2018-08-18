import React from "react";
//
import { ChartConnect, PointerConnect } from "../utils/Context";
import Selectors from "../utils/Selectors";

import Html from "../primitives/Html";
const { Div } = Html;

class Brush extends React.PureComponent {
  static defaultProps = {
    onSelect: () => {}
  };
  static isHtml = true;
  componentDidUpdate(oldProps) {
    const { onSelect, pointer, primaryAxes } = oldProps;
    if (
      oldProps.pointer &&
      this.props.pointer.released !== oldProps.pointer.released
    ) {
      if (Math.abs(pointer.sourceX - pointer.x) < 20) {
        return;
      }
      onSelect({
        pointer: this.props.pointer.released,
        start: primaryAxes[0].scale.invert(pointer.sourceX),
        end: primaryAxes[0].scale.invert(pointer.x)
      });
    }
  }
  render() {
    const {
      pointer = {},
      offset,
      gridX,
      gridY,
      gridHeight,
      dark,
      style = {}
    } = this.props;

    return (
      <Div
        className="Brush"
        style={{
          pointerEvents: "none",
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate(${offset.left + gridX}px, ${offset.top +
            gridY}px)`,
          opacity: pointer.dragging
            ? Math.abs(pointer.sourceX - pointer.x) < 20
              ? 0.5
              : 1
            : 0
        }}
      >
        <Div
          style={{
            position: "absolute",
            transform: `translate(${Math.min(
              pointer.x,
              pointer.sourceX
            )}px, 0px)`,
            width: `${Math.abs(pointer.x - pointer.sourceX)}px`,
            height: `${gridHeight}px`,
            background: dark ? "rgba(255,255,255,.3)" : "rgba(0, 26, 39, 0.3)",
            ...style
          }}
        />
      </Div>
    );
  }
}

export default PointerConnect(state => ({
  pointer: state.pointer
}))(
  ChartConnect(() => {
    const selectors = {
      primaryAxes: Selectors.primaryAxes(),
      offset: Selectors.offset(),
      gridHeight: Selectors.gridHeight(),
      gridX: Selectors.gridX(),
      gridY: Selectors.gridY()
    };
    return state => ({
      primaryAxes: selectors.primaryAxes(state),
      offset: selectors.offset(state),
      gridHeight: selectors.gridHeight(state),
      gridX: selectors.gridX(state),
      gridY: selectors.gridY(state),
      dark: state.dark
    });
  })(Brush)
);
