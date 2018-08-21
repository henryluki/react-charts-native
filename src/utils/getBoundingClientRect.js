import { findNodeHandle, UIManager } from "react-native";

function transformBoundingClientRect(x, y, width, height, pageX, pageY) {
  return {
    left: pageX,
    top: pageY,
    right: pageX + width,
    bottom: pageY + height,
    width: width,
    height: height,
    offsetLeft: x,
    offsetTop: y
  };
}

export async function getBoundingClientRect(ref) {
  return new Promise(resolve => {
    UIManager.measure(findNodeHandle(ref), (...args) => {
      resolve(transformBoundingClientRect(...args));
    });
  });
}

export async function getBoundingClientRects(refs) {
  const measurePromises = refs.reduce((acc, ref) => {
    return acc.concat(getBoundingClientRect(ref));
  }, []);

  return Promise.all(measurePromises);
}
