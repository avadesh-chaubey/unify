import React, { useRef, useLayoutEffect } from "react";
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
let am4core = null;
let am4charts = null;
let am4themesAnimated = null;
if (process.browser) {
  am4core = require("@amcharts/amcharts4/core");
  am4charts = require("@amcharts/amcharts4/charts");
  am4themesAnimated = require("@amcharts/amcharts4/themes/animated");
  am4core.useTheme(am4themesAnimated.default);
}

/* Chart code */
// Themes begin
// am4core.useTheme(am4themes_animated);
// Themes end

function Hospitalsurveychart(props) {
  const chart = useRef(null);

  useLayoutEffect(() => {
    // Create chart instance
    var chart = am4core.create("chartdiv3", am4charts.XYChart);
    chart.paddingRight = 25;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.disabled = false;
    chart.cursor.lineY.disabled = false;

    // Add data
    chart.data = [
      {
        date: new Date(2018, 3, 20),
        value: 1800,
        value2: 1700,
        value3: 1600,
      },
      {
        date: new Date(2018, 3, 21),
        value: 1000,
        value2: 900,
        value3: 600,
      },
      {
        date: new Date(2018, 3, 22),
        value: 900,
        value2: 1400,
        value3: 1800,
      },
      {
        date: new Date(2018, 3, 23),
        value: 1197,
        value2: 1298,
        value3: 1800,
      },
      {
        date: new Date(2018, 3, 24),
        value: 999,
        value2: 1700,
        value3: 765,
      },
      {
        date: new Date(2018, 3, 25),
        value: 600,
        value2: 1897,
        value3: 1000,
      },
      {
        date: new Date(2018, 3, 26),
        value: 1100,
        value2: 1200,
        value3: 1543,
      },
      {
        date: new Date(2018, 3, 27),
        value: 1166,
        value2: 1288,
        value3: 1765,
      },
      {
        date: new Date(2018, 3, 28),
        value: 1678,
        value2: 1200,
        value3: 1500,
      },
      {
        date: new Date(2018, 3, 29),
        value: 1454,
        value2: 876,
        value3: 1000,
      },
    ];

    chart.legend = new am4charts.Legend();
    chart.legend.contentAlign = "right";
    chart.legend.position = "top";
    chart.legend.paddingBottom = 20;
    chart.legend.fontFamily = "Bahnschrift SemiBold";
    chart.legend.fontSize = "14px";
    chart.legend.labels.template.maxWidth = 2;
    chart.legend.useDefaultMarker = true;
    let marker = chart.legend.markers.template.children.getIndex(0);
    marker.strokeWidth = 0.3;
    marker.cornerRadius(2, 2, 2, 2);
    marker.fontFamily = "Bahnschrift SemiBold";
    marker.fontSize = "15px";
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 15;
    markerTemplate.height = 15;

    chart.colors.list = [
      am4core.color("#2CD889"),
      am4core.color("#FECD54"),
      am4core.color("#F7617D"),
    ];
    chart.fontFamily = "Bahnschrift SemiBold";
    chart.fontSize = "13px";
    chart.fontColor = "#A6B1C2";

    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    dateAxis.renderer.grid.template.strokeWidth = 0;

    // Create value axis
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    var series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "value";
    series1.dataFields.dateX = "date";
    (series1.name = "TOTAL PATIENTS"), (series1.strokeWidth = 2);
    series1.tensionX = 0.8;

    var series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "value2";
    series2.dataFields.dateX = "date";
    (series2.name = "NEW PATIENTS"), (series2.strokeWidth = 2);
    series2.strokeDasharray = "3,3";
    series2.tooltipText = "{valueY}";
    series2.strokeWidth = 3;
    series2.tensionX = 0.8;

    var series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.valueY = "value3";
    series3.dataFields.dateX = "date";
    (series3.name = "OLD PATIENTS"), (series3.strokeWidth = 2);
    series3.strokeDasharray = "3,3";
    series3.tooltipText = "{name}\n{valueY}";
    series3.strokeWidth = 3;
    series3.tensionX = 0.8;
  }, []);

  return <div id="chartdiv3" style={{ width: "100%", height: "350px" }}></div>;
}
export default Hospitalsurveychart;
