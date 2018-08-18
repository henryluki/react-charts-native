// @flow
import React from "react";
import { ART } from "react-native";
import transCssStyle from "../utils/transCssStyle";
import transTransform from "../utils/transTransform";

const { Shape } = ART;

const defaultStyle = {
  strokeWidth: 2,
  stroke: "#6b6b6b",
  opacity: 1
};

export default class Path extends React.Component {
  static defaultProps = {
    opacity: 1
  };
  render() {
    const { style, opacity, ...rest } = this.props;
    const resolvedStyle = {
      ...defaultStyle,
      ...transCssStyle(style)
    };
    const transform = transTransform(resolvedStyle.transform);

    return <Shape {...rest} {...resolvedStyle} transform={transform} />;
  }
}
