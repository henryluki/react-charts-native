// @flow
import React from "react";
import { View as RawView, Text as RawText } from "react-native";
import transCssStyle from "../utils/transCssStyle";

class View extends React.Component {
  render() {
    const { style, ...rest } = this.props;

    return <RawView {...rest} {...transCssStyle(style)} />;
  }
}

class Text extends React.Component {
  render() {
    const { style, ...rest } = this.props;

    return <RawText {...rest} {...transCssStyle(style)} />;
  }
}

export default {
  Div: View,
  Table: View,
  Tbody: View,
  Tr: View,
  Td: View,
  Strong: Text,
  Span: Text
};
