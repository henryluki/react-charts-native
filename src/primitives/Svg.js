// @flow
import React from "react";
import { ART } from "react-native";
import transCssStyle from "../utils/transCssStyle";
import transTransform from "../utils/transTransform";

const { Surface } = ART;

export default class Svg extends React.Component {
  render() {
    const { style, ...rest } = this.props;
    const resolvedStyle = transCssStyle(style);
    const transform = transTransform(resolvedStyle.transform);

    return (
      <Surface {...rest} {...transCssStyle(style)} transform={transform} />
    );
  }
}
