// @flow
import React from "react";
import { ART } from "react-native";
import transCssStyle from "../utils/transCssStyle";
import transTransform from "../utils/transTransform";

const { Path, Shape } = ART;

const defaultStyle = {
  strokeWidth: 0,
  fill: "#333",
  opacity: 1
};

export default class Rectangle extends React.Component {
  static defaultProps = {
    opacity: 1
  };
  render() {
    const { style, opacity, x1, y1, x2, y2, ...rest } = this.props;

    const resolvedStyle = {
      ...defaultStyle,
      ...transCssStyle(style)
    };
    const transform = transTransform(resolvedStyle.transform);

    const xStart = Math.min(x1, x2);
    const yStart = Math.min(y1, y2);
    const xEnd = Math.max(x1, x2);
    const yEnd = Math.max(y1, y2);

    const height = Math.max(yEnd - yStart, 0);
    const width = Math.max(xEnd - xStart, 0);

    const _xEnd = width + xStart;
    const _yEnd = height + yStart;

    const path = new Path()
      .moveTo(xStart, yStart)
      .lineTo(_xEnd, yStart)
      .lineTo(_xEnd, _yEnd)
      .lineTo(xStart, _yEnd)
      .lineTo(xStart, yStart)
      .close();

    return (
      <Shape {...rest} d={path} {...resolvedStyle} transform={transform} />
    );
  }
}
