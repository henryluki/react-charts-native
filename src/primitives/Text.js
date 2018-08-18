// @flow
import React from "react";
import { ART } from "react-native";
import transCssStyle from "../utils/transCssStyle";

const defaultStyle = {
  opacity: 1,
  fill: "#000000"
};

export default class Text extends React.Component {
  static defaultProps = {
    opacity: 1
  };
  render() {
    const { style, opacity, children, ...rest } = this.props;

    const resolvedStyle = {
      ...defaultStyle,
      ...transCssStyle(style)
    };

    return (
      <ART.Text
        {...rest}
        {...resolvedStyle}
        font={{
          fontFamily: "Helvetica",
          fontSize: resolvedStyle.fontSize || 10
        }}
      >
        {"a" || children}
      </ART.Text>
    );
  }
}
