// @flow
import React from "react";
import { ART } from "react-native";
import transCssStyle from "../utils/transCssStyle";
import transTransform from "../utils/transTransform";

const { Path, Shape } = ART;

const defaultStyle = {
  r: 2,
  strokeWidth: "1",
  stroke: "#000000",
  fill: "#000000",
  opacity: 1
};

export default class Circle extends React.Component {
  static defaultProps = {
    opacity: 1
  };
  render() {
    const { x = 0, y = 0, style, opacity, ...rest } = this.props;
    const resolvedStyle = {
      ...defaultStyle,
      ...transCssStyle(style)
    };
    const transform = transTransform(resolvedStyle.transform);
    const r = rest.r || resolvedStyle.r;
    const path = new Path()
      .moveTo(x, y - r)
      .arc(0, r * 2, r)
      .arc(0, r * -2, r)
      .close();

    return (
      <Shape {...rest} {...resolvedStyle} d={path} transform={transform} />
    );
  }
}
