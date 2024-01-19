import React, { useRef, useEffect, useState } from "react";
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// am4core.useTheme(am4themes_animated);
let am4core = null;
let am4charts = null;
let am4themesAnimated = null;
if (process.browser) {
  am4core = require("@amcharts/amcharts4/core");
  am4charts = require("@amcharts/amcharts4/charts");
  am4themesAnimated = require("@amcharts/amcharts4/themes/animated");
  am4core.useTheme(am4themesAnimated.default);
}

function Appointmentschart(props) {
  const { AppointmentData } = props;
  console.log("=====>AppointmentData", AppointmentData);

  const chart = useRef(null);
  useEffect(() => {
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    // chart.paddingRight = 30;
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.disabled = false;
    chart.cursor.lineY.disabled = false;
    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";
    chart.legend.contentAlign = "right";
    chart.legend.fontFamily = "Bahnschrift SemiBold !important";
    chart.legend.fontSize = "14px";
    chart.legend.paddingBottom = 20;
    chart.legend.labels.template.maxWidth = 2;
    chart.legend.useDefaultMarker = true;
    let marker = chart.legend.markers.template.children.getIndex(0);
    marker.strokeWidth = 0.5;
    marker.cornerRadius(0, 0, 0, 0);
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 12;
    markerTemplate.height = 12;
    // Modify chart's colors
    chart.colors.list = [
      am4core.color("#2896E9"),
      am4core.color("#AE4AFA"),
      am4core.color("#F36F4E"),
    ];
    chart.fontFamily = "Bahnschrift SemiBold !important";
    chart.fontWeight = "normal";
    chart.fontSize = "13px";
    chart.fontColor = "#748AA1";
    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = "category";
    xAxis.renderer.cellStartLocation = 0.1;
    xAxis.renderer.cellEndLocation = 0.9;
    xAxis.renderer.grid.template.location = 0;
    xAxis.renderer.grid.template.strokeWidth = 0;
    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;
    function createSeries(value, name) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = value;
      series.dataFields.categoryX = "category";
      series.name = name;
      // series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
      series.tooltipText = "{name}\n[bold font-size: 20] {valueY}[/]";
      series.columns.template.fillOpacity = 0.8;
      series.events.on("hidden", arrangeColumns);
      series.events.on("shown", arrangeColumns);
      let bullet = series.bullets.push(new am4charts.LabelBullet());
      bullet.interactionsEnabled = false;
      bullet.dy = 30;
      bullet.label.fill = am4core.color("#ffffff");
      return series;
    }
    chart.data = AppointmentData;
    // chart.data = [
    //   {
    //     category: "Dec 2020",
    //     book: 40,
    //     reschedule: 55,
    //     cancelled: 60,
    //   },
    //   {
    //     category: "Jan 2021",
    //     book: 30,
    //     reschedule: 78,
    //     cancelled: 69,
    //   },
    //   {
    //     category: "Feb 2021",
    //     book: 27,
    //     reschedule: 40,
    //     cancelled: 45,
    //   },
    //   {
    //     category: "Mar 2021",
    //     book: 50,
    //     reschedule: 33,
    //     cancelled: 22,
    //   },
    //   {
    //     category: "April 2021",
    //     book: 50,
    //     reschedule: 33,
    //     cancelled: 22,
    //   },
    // ];
    createSeries("book", "Book");
    createSeries("reschedule", "Reschedule");
    createSeries("cancelled", "Cancelled");
    function arrangeColumns() {
      let series = chart.series.getIndex(0);
      let w =
        1 -
        xAxis.renderer.cellStartLocation -
        (1 - xAxis.renderer.cellEndLocation);
      if (series.dataItems.length > 1) {
        let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
        let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
        let delta = ((x1 - x0) / chart.series.length) * w;
        if (am4core.isNumber(delta)) {
          let middle = chart.series.length / 2;
          let newIndex = 0;
          chart.series.each(function (series) {
            if (!series.isHidden && !series.isHiding) {
              series.dummyData = newIndex;
              newIndex++;
            } else {
              series.dummyData = chart.series.indexOf(series);
            }
          });
          let visibleCount = newIndex;
          let newMiddle = visibleCount / 2;
          chart.series.each(function (series) {
            let trueIndex = chart.series.indexOf(series);
            let newIndex = series.dummyData;
            let dx = (newIndex - trueIndex + middle - newMiddle) * delta;
            series.animate(
              { property: "dx", to: dx },
              series.interpolationDuration,
              series.interpolationEasing
            );
            series.bulletsContainer.animate(
              { property: "dx", to: dx },
              series.interpolationDuration,
              series.interpolationEasing
            );
          });
        }
      }
    }
  }, []);
  return (
    <div
      id="chartdiv"
      style={{
        width: "540px",
        height: "350px",
        fontFamily: "Bahnschrift SemiBold",
      }}
    ></div>
  );
}
export default Appointmentschart;
