// @flow
import React from "react";
import { ScrollView, View } from "react-native";

import {
  Chart,
  Axis,
  Series,
  Tooltip,
  Area,
  Line,
  Cursor,
  Pie,
  Bubble,
  Bar
} from "./src";

export default class App extends React.Component {
  render() {
    return (
      <ScrollView>
        <Chart data={makeData()}>
          <Axis primary type="time" position="bottom" show={true} />
          <Axis type="linear" position="left" show={true} />
          <Series type={Line} />
          <Cursor primary />
          <Cursor />
          <Tooltip />
        </Chart>

        <Chart data={makeData()}>
          <Axis primary type="time" position="left" />
          <Axis type="linear" stacked position="bottom" />
          <Series type={Bar} />
          <Cursor primary />
          <Cursor />
          <Tooltip />
        </Chart>

        <Chart data={makeData()}>
          <Axis primary type="time" />
          <Axis type="linear" min={0} max={0} stacked />
          <Series type={Bar} />
          <Cursor primary />
          <Cursor />
          <Tooltip />
        </Chart>

        <Chart data={makeData()}>
          <Axis type="pie" />
          <Series type={Pie} showPoints={false} />
          <Tooltip />
        </Chart>

        <Chart data={makeData()}>
          <Axis primary type="time" position="bottom" />
          <Axis type="linear" position="left" stacked />
          <Series type={Area} />
          <Tooltip />
        </Chart>

        <Chart data={makeData()}>
          <Axis primary type="time" position="bottom" />
          <Axis type="linear" position="left" />
          <Series type={Bubble} />
          <Cursor primary />
          <Cursor />
          <Tooltip />
        </Chart>
      </ScrollView>
    );
  }
}

function makeData() {
  return [...new Array(Math.max(Math.round(Math.random() * 5), 1))].map(
    (d, i) => makeSeries(i, "time")
  );
}

function makeSeries(i, dataType) {
  const start = 0;
  const startDate = new Date();
  startDate.setMinutes(0);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);
  // const length = 5 + Math.round(Math.random() * 15)
  const length = 10;
  const min = 0;
  const max = 100;
  const rMin = 2;
  const rMax = 20;
  const nullChance = 0;
  return {
    label: `Series ${i + 1}`,
    datums: [...new Array(length)].map((_, i) => {
      let x = start + i;
      if (dataType === "time") {
        x = new Date(startDate.getTime() + 60 * 1000 * 30 * i);
      }
      const distribution = 1.1;
      const y =
        Math.random() < nullChance
          ? null
          : min + Math.round(Math.random() * (max - min));
      const r =
        rMax -
        Math.floor(
          Math.log(Math.random() * (distribution ** rMax - rMin) + rMin) /
            Math.log(distribution)
        );
      return {
        x,
        y,
        r
      };
    })
  };
}
