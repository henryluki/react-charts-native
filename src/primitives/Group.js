// @flow
import React from "react";
import { ART } from "react-native";
import transCssStyle from "../utils/transCssStyle";
import transTransform from "../utils/transTransform";

export default class Group extends React.Component {
  render() {
    const { style, ...rest } = this.props;
    const resolvedStyle = transCssStyle(style);
    const transform = transTransform(resolvedStyle.transform);

    return <ART.Group {...rest} {...resolvedStyle} transform={transform} />;
  }
}
