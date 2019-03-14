var pivot = new WebDataRocks({
    container: "#wdr-component",
    toolbar: true,
    report: {
        "dataSource": {
            "dataSourceType": "csv",
            "filename": "../data/data.csv"
        },
        "slice": {
            "rows": [{
                "uniqueName": "Country",
                "sort": "asc"
            }],
            "columns": [{
                "uniqueName": "Category",
                "sort": "asc"
            }, {
                "uniqueName": "Measures"
            }],
            "measures": [{
                "uniqueName": "Price",
                "aggregation": "sum"
            }]
        },
        "formats": [{
            "name": "",
            "thousandsSeparator": " ",
            "decimalSeparator": ".",
            "decimalPlaces": 2,
            "maxSymbols": 20,
            "currencySymbol": "",
            "currencySymbolAlign": "left",
            "nullValue": " ",
            "infinityValue": "Infinity",
            "divideByZeroValue": "Infinity"
        }]
    },
    reportcomplete: function() {
        pivot.off("reportcomplete");
        pivotTableReportComplete = true;
        createGoogleChart();
    }
});

var pivotTableReportComplete = false;
var googleChartsLoaded = false;

google.charts.load('current', {
    'packages': ['geochart'],
    'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
});
google.charts.setOnLoadCallback(onGoogleChartsLoaded);

function onGoogleChartsLoaded() {
    googleChartsLoaded = true;
    if (pivotTableReportComplete) {
        createGoogleChart();
    }
}

function createGoogleChart() {
    if (googleChartsLoaded) {
        pivot.googlecharts.getData({
                type: "bar"
            },
            drawChart,
            drawChart
        );
    }
}

function drawChart(_data) {
    var data = google.visualization.arrayToDataTable(_data.data);

    var options = {
        colorAxis: {
            colors: ['#449544', '#4ca64c', '#7fbf7f', '#b2d8b2']
        },
        backgroundColor: '#b3e5fc',
        datalessRegionColor: '#ffffff',
        defaultColor: '#f5f5f5',
    };

    var chart = new google.visualization.GeoChart(document.getElementById('googlechart-container'));
    chart.draw(data, options);
}