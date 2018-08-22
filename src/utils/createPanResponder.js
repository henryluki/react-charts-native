// @flow

import { PanResponder } from "react-native";

type ResponderFunction = (evt: Object, gestureState: Object) => void;

export default function createPanResponder({
  start,
  move,
  end,
  cancel
}: {
  start?: ResponderFunction,
  move?: ResponderFunction,
  end?: ResponderFunction,
  cancel?: ResponderFunction
}) {
  return PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      // start
      start && start(evt, gestureState);
    },
    onPanResponderMove: (evt, gestureState) => {
      // move
      move && move(evt, gestureState);
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      // end
      end && end(evt, gestureState);
    },
    onPanResponderTerminate: (evt, gestureState) => {
      // cancel
      cancel && cancel(evt, gestureState);
    },
    onShouldBlockNativeResponder: (evt, gestureState) => {
      return true;
    }
  }).panHandlers;
}
