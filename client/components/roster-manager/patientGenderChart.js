import React, { useRef, useLayoutEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

const PatientGenderchart = () => {

    const chart = useRef(null);
    useLayoutEffect(() => {
        let chart = am4core.create("chartdiv2", am4charts.PieChart);
        

        // Add data
        chart.data = [{
            "country": "Men",
            "litres": 132,
        }, {
            "country": "Woman",
            "litres": 72
        }, {
            "country": "Kids",
            "litres": 108
        }, {
            "country": "Other",
            "litres": 88
        },];


        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "litres";
        pieSeries.dataFields.category = "country";
        chart.legend = new am4charts.Legend();

        //         pieSeries.labels.template.disabled = true;
        // pieSeries.ticks.template.disabled = true;

        // // Disable tooltips
        // pieSeries.slices.template.tooltipText = "";

        // pieSeries.alignLabels = false;
        // pieSeries.labels.template.bent = true;
        // pieSeries.labels.template.radius = -25;
        // pieSeries.labels.template.padding(0, 0, 0, 0);
        // pieSeries.labels.template.fill = am4core.color("#fff");
        // pieSeries.ticks.template.disabled = true;

        pieSeries.ticks.template.disabled = true;
        pieSeries.alignLabels = false;
        pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
        pieSeries.labels.template.radius = am4core.percent(-40);
        pieSeries.labels.template.fill = am4core.color("#707070");

        chart.legend = new am4charts.Legend()
        chart.legend.contentAlign = "center";
        chart.legend.position = 'bottam';
        chart.legend.paddingBottom = 20;
        chart.legend.fontSize = '14px';
        chart.legend.valueLabels.template.text = "   ";
        chart.legend.valueLabels.template.width = 50;
        chart.legend.labels.template.maxWidth = 2;
        chart.legend.useDefaultMarker = true;
        chart.legend.maxColumns = 2;
        // chart.legend.valueAlign = "center";
        let marker = chart.legend.markers.template.children.getIndex(0);
        marker.strokeWidth = .5;
        marker.cornerRadius(2, 2, 2, 2);
        let markerTemplate = chart.legend.markers.template;
        markerTemplate.width = 40;
        markerTemplate.height = 8;

        pieSeries.colors.list = [
            am4core.color("#FFCD54"),
            am4core.color("#00BBFF"),
            am4core.color("#2CD889"),
            am4core.color("#F7617D"),
        ];

    }, []);
    return (
        <div id="chartdiv2" style={{ width: "100%", height: "350px", }}></div>
    );
}
export default PatientGenderchart;