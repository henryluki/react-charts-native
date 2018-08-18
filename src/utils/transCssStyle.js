// @flow
import tansform from "css-to-react-native";

const uselessStylesValues = ["transparent", "none", undefined];

export default function transCssStyle(style?: Object) {
  if (!style) return {};

  const keys = Object.keys(style);
  const allStyle = keys.reduce(
    (acc, key) => {
      const value = style[key];
      if (
        uselessStylesValues.indexOf(value) > -1 ||
        typeof value === "object"
      ) {
        acc.noNeedToTrans[key] = undefined;
      } else {
        acc.needToTrans.push([key, style[key] + ""]);
      }

      return acc;
    },
    {
      needToTrans: [],
      noNeedToTrans: {}
    }
  );

  try {
    const resolveStyle = tansform(allStyle.needToTrans);
    return Object.assign({}, allStyle.noNeedToTrans, resolveStyle);
  } catch (e) {
    console.log(e);
    return allStyle.noNeedToTrans;
  }
}
