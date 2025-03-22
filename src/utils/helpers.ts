import {IChartApi} from "lightweight-charts";

export function syncTVCharts(chart1: IChartApi, chart2: IChartApi) {

    chart1.timeScale().subscribeVisibleLogicalRangeChange(timeRange => {
        chart2.timeScale().setVisibleLogicalRange(timeRange);
    });

    chart2.timeScale().subscribeVisibleLogicalRangeChange(timeRange => {
        chart1.timeScale().setVisibleLogicalRange(timeRange);
    });

    function getCrosshairDataPoint(series, param) {
        if (!param.time) {
            return null;
        }
        const dataPoint = param.seriesData.get(series);
        return dataPoint || null;
    }

    function syncCrosshair(chart, series, dataPoint) {
        if (dataPoint) {
            chart.setCrosshairPosition(dataPoint.value, dataPoint.time, series);
            return;
        }
        chart.clearCrosshairPosition();
    }

    const mainSeries1 = chart1.panes()[0].getSeries()[0];
    const mainSeries2 = chart2.panes()[0].getSeries()[0];

    chart1.subscribeCrosshairMove(param => {
        const dataPoint = getCrosshairDataPoint(mainSeries1, param);
        syncCrosshair(chart2, mainSeries2, dataPoint);
    });
    chart2.subscribeCrosshairMove(param => {
        const dataPoint = getCrosshairDataPoint(mainSeries2, param);
        syncCrosshair(chart1, mainSeries1, dataPoint);
    });
}