import React from "react";
import { Dimensions, View } from "react-native";

import RAF from "raf";
//
import Selectors from "../utils/Selectors";
import Utils from "../utils/Utils";
import * as Debug from "../utils/Debug";
import { ChartProvider, PointerProvider } from "../utils/Context";
import { getBoundingClientRect } from "../utils/getBoundingClientRect";

import Rectangle from "../primitives/Rectangle";
import Svg from "../primitives/Svg";
import Voronoi from "../components/Voronoi";
import Group from "../primitives/Group";
import Html from "../primitives/Html";

const { Div } = Html;

const defaultWidth = Dimensions.get("window").width - 20;
const defaultHeight = 200;
const debug = process.env.NODE_ENV === "development";

export default ({ width, height, ...rest }) => {
  const containerWidth = width || defaultWidth;
  const containerHeight = height || defaultHeight;

  return <Chart width={containerWidth} height={containerHeight} {...rest} />;
};

class Chart extends React.Component {
  static defaultProps = {
    getSeries: d => d,
    getDatums: d => (Utils.isArray(d) ? d : d.datums || d.data),
    getLabel: (d, i) => d.label || `Series ${i + 1}`,
    getSeriesID: (d, i) => i,
    getPrimary: d => (Utils.isArray(d) ? d[0] : d.primary || d.x),
    getSecondary: d => (Utils.isArray(d) ? d[1] : d.secondary || d.y),
    getR: d => (Utils.isArray(d) ? d[2] : d.radius || d.r),
    getPrimaryAxisID: s => s.primaryAxisID,
    getSecondaryAxisID: s => s.secondaryAxisID,
    onHover: () => {},
    interaction: null,
    hoverMode: "primary",
    groupMode: "primary",
    showVoronoi: false
  };
  constructor({ interaction, hoverMode, groupMode, showVoronoi, dark }) {
    super();
    this.state = {
      chartState: {
        hovered: {
          active: false,
          series: null,
          datums: []
        },
        cursors: {},
        axes: {},
        tooltip: {},
        axisDimensions: {},
        interaction,
        hoverMode,
        groupMode,
        showVoronoi,
        dark,
        dispatch: fn =>
          this.setState(state => ({
            chartState: fn(state.chartState)
          }))
      },
      pointerState: {
        pointer: {},
        dispatch: fn =>
          this.setState(state => ({
            pointerState: fn(state.pointerState)
          }))
      }
    };
    this.selectors = {
      gridX: Selectors.gridX(),
      gridY: Selectors.gridY(),
      offset: Selectors.offset()
    };
  }
  static getDerivedStateFromProps(props, state) {
    const { data, width, height } = props;
    if (Utils.shallowCompare(props, state, ["data", "width", "height"])) {
      return {
        chartState: {
          ...state.chartState,
          data,
          width,
          height
        }
      };
    }
    return null;
  }
  componentDidUpdate(prevProps, prevState) {
    const changes = [];
    ["interaction", "hoverMode", "groupMode", "showVoronoi"].forEach(prop => {
      if (prevProps[prop] !== this.props[prop]) {
        changes.push(prop);
      }
    });
    if (changes.length) {
      const changeObj = {};
      changes.forEach(prop => {
        changeObj[prop] = this.props[prop];
      });
      this.state.chartState.dispatch(state => ({
        ...state,
        ...changeObj
      }));
    }
    if (
      Utils.shallowCompare(prevProps, this.props, ["data", "width", "height"])
    ) {
      this.updateDataModel(this.props);
    } else {
      RAF(() => this.measure(prevProps, prevState));
    }
  }
  updateDataModel = props => {
    const { data, width, height } = props;
    let {
      getSeries,
      getDatums,
      getLabel,
      getSeriesID,
      getPrimary,
      getSecondary,
      getR,
      getPrimaryAxisID,
      getSecondaryAxisID
    } = props;

    // Normalize getters
    getSeries = Utils.normalizePathGetter(getSeries);
    getDatums = Utils.normalizePathGetter(getDatums);
    getLabel = Utils.normalizePathGetter(getLabel);
    getSeriesID = Utils.normalizePathGetter(getSeriesID);
    getPrimary = Utils.normalizePathGetter(getPrimary);
    getSecondary = Utils.normalizePathGetter(getSecondary);
    getR = Utils.normalizePathGetter(getR);
    getPrimaryAxisID = Utils.normalizePathGetter(getPrimaryAxisID);
    getSecondaryAxisID = Utils.normalizePathGetter(getSecondaryAxisID);

    // Check for data
    if (!data) {
      if (debug) Debug.noData(this);
      return;
    }

    // getSeries
    const series = getSeries(data);

    // Check for data
    if (!series) {
      if (debug) Debug.noData(this);
      return;
    }

    // First access the data, and provide it to the context
    const preMaterializedData = series.map((s, seriesIndex) => {
      const seriesID = getSeriesID(s, seriesIndex, data);
      const seriesLabel = getLabel(s, seriesIndex, data);
      const primaryAxisID = getPrimaryAxisID(s, seriesIndex, data);
      const secondaryAxisID = getSecondaryAxisID(s, seriesIndex, data);
      const series = {
        original: s,
        index: seriesIndex,
        id: seriesID,
        label: seriesLabel,
        primaryAxisID,
        secondaryAxisID,
        datums: getDatums(s, seriesIndex, data).map((d, index) => ({
          originalSeries: s,
          seriesIndex,
          seriesID,
          seriesLabel,
          index,
          original: d,
          primary: getPrimary(d, index, s, seriesIndex, data),
          secondary: getSecondary(d, index, s, seriesIndex, data),
          r: getR(d, index, s, seriesIndex, data)
        }))
      };
      return series;
    });

    // Provide the preMaterializedData to the chart instance
    this.state.chartState.dispatch(state => ({
      ...state,
      preMaterializedData,
      width,
      height
    }));
  };
  measure = async (prevProps, prevState) => {
    if (!this.el) {
      return;
    }
    this.dims = await getBoundingClientRect(this.el);
    const { offset } = this.getSelectedState(this.state.chartState);
    const { offset: prevOffset } = this.getSelectedState(prevState);

    if (
      prevProps &&
      (offset.left !== prevOffset.left || offset.top !== prevOffset.top)
    ) {
      this.state.chartState.dispatch(state => ({
        ...state,
        offset: {
          left: this.dims.offsetLeft,
          top: this.dims.offsetTop
        }
      }));
    }
  };
  getSelectedState(state) {
    return {
      gridX: this.selectors.gridX(state),
      gridY: this.selectors.gridY(state),
      offset: this.selectors.offset(state)
    };
  }
  render() {
    const {
      containerWidth,
      containerHeight,
      width,
      height,
      children
    } = this.props;

    const { gridX, gridY } = this.getSelectedState(this.state.chartState);

    const allChildren = React.Children.toArray(children);
    const svgChildren = allChildren.filter(d => !d.type.isHtml);
    const htmlChildren = allChildren.filter(d => d.type.isHtml);

    return (
      <ChartProvider value={this.state.chartState}>
        <PointerProvider value={this.state.pointerState}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              position: "relative"
            }}
          >
            <Svg
              ref={el => {
                this.el = el;
              }}
              style={{
                width,
                height,
                overflow: "hidden"
              }}
            >
              <Group
                // onMouseEnter={e => {
                //   e.persist();
                //   this.onMouseMove(e);
                // }}
                // onMouseMove={e => {
                //   e.persist();
                //   this.onMouseMove(e);
                // }}
                // onMouseLeave={this.onMouseLeave}
                // onMouseDown={this.onMouseDown}
                style={{
                  transform: `translate(${gridX || 0}px, ${gridY || 0}px)`
                }}
              >
                <Rectangle
                  // This is to ensure the pointer always has something to hit
                  x1={-gridX}
                  x2={width - gridX}
                  y1={-gridY}
                  y2={height - gridY}
                  style={{
                    opacity: 0
                  }}
                />
                <Voronoi />
                {svgChildren}
              </Group>
            </Svg>
            {htmlChildren}
          </View>
        </PointerProvider>
      </ChartProvider>
    );
  }
  onMouseMove = Utils.throttle(e => {
    const { clientX, clientY } = e;
    const { gridX, gridY } = this.getSelectedState(this.state.chartState);

    this.state.pointerState.dispatch(state => {
      const x = clientX - this.dims.left - gridX;
      const y = clientY - this.dims.top - gridY;

      const pointer = {
        ...state.pointer,
        active: true,
        x,
        y,
        dragging: state.pointer && state.pointer.down
      };
      return {
        ...state,
        pointer
      };
    });
  });
  onMouseLeave = () => {
    this.state.chartState.dispatch(state => ({
      ...state,
      hovered: {
        ...state.hovered,
        active: false
      }
    }));
    this.state.pointerState.dispatch(state => ({
      ...state,
      pointer: {
        ...state.pointer,
        active: false
      }
    }));
  };
  onMouseDown = () => {
    document.addEventListener("mouseup", this.onMouseUp);
    document.addEventListener("mousemove", this.onMouseMove);

    this.state.pointerState.dispatch(state => ({
      ...state,
      pointer: {
        ...state.pointer,
        sourceX: state.pointer.x,
        sourceY: state.pointer.y,
        down: true
      }
    }));
  };
  onMouseUp = () => {
    document.removeEventListener("mouseup", this.onMouseUp);
    document.removeEventListener("mousemove", this.onMouseMove);

    this.state.pointerState.dispatch(state => ({
      ...state,
      pointer: {
        ...state.pointer,
        down: false,
        dragging: false,
        released: {
          x: state.pointer.x,
          y: state.pointer.y
        }
      }
    }));
  };
}
