// @flow
import { ART } from "react-native";

const { Transform } = ART;

export default function transTransform(transforms?: Array<number>) {
  if (!transforms) {
    return undefined;
  }

  const transformStyle = transforms.reduce((acc, transform) => {
    return Object.assign(acc, transform);
  }, {});
  const { translateX, translateY, scaleX, scaleY, rotate } = transformStyle;
  const transform = new Transform().transformTo(1, 0, 0, 1, 0, 0);

  if (translateX !== undefined || translateY !== undefined) {
    transform.move(translateX || 0, translateY || 0);
  }

  if (rotate !== undefined) {
    transform.rotate(rotate || 0);
  }

  if (scaleX !== undefined || scaleY !== undefined) {
    transform.scale(scaleX || 1, scaleY || 1);
  }

  return transform;
}
