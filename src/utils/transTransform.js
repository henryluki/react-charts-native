// @flow
import { ART } from "react-native";

const { Transform } = ART;

export default function transTransform(transforms?: Array<number>) {
  if (!transforms) {
    return undefined;
  }

  const transformStyle = transforms.reduce((acc, transform) => {
    if (transform.rotate !== undefined) {
      transform.rotate = transform.rotate.replace(
        /(\d+)deg/g,
        ($input, $1) => $1
      );
    }
    return Object.assign(acc, transform);
  }, {});
  const { translateX, translateY, scaleX, scaleY, rotate } = transformStyle;
  const transform = new Transform();

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
