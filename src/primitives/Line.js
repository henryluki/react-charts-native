// @flow
import React from "react";
import { ART } from "react-native";
import transCssStyle from "../utils/transCssStyle";
import transTransform from "../utils/transTransform";

const { Path, Shape } = ART;

const defaultStyle = {
  strokeWidth: 1,
  opacity: 1
};

export default class Line extends React.Component {
  render() {
    const { style, x1 = 0, x2 = 0, y1 = 0, y2 = 0, ...rest } = this.props;
    const resolvedStyle = {
      ...defaultStyle,
      ...transCssStyle(style)
    };
    const transform = transTransform(resolvedStyle.transform);
    const path = new Path()
      .moveTo(x1, y1)
      .lineTo(x2, y2)
      .close();

    return (
      <Shape {...rest} {...resolvedStyle} d={path} transform={transform} />
    );
  }
}
