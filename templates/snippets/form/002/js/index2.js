var pivot = new Flexmonster({
    container: "#pivot-container",
    componentFolder: "https://cdn.flexmonster.com/",
    licenseFilePath: "https://cdn.flexmonster.com/codepen.key",
    width: "100%",
    height: 430,
    toolbar: true,
    report: {
        dataSource: {
            filename: "data/sales.csv"
        },
        slice: {
            rows: [{
                uniqueName: "Month"
            }, {
                uniqueName: "[Measures]"
            }],
            columns: [{
                uniqueName: "Category",
                levelName: "Product Name",
                filter: {
                    members: [
                        "category.[condiments].[bbq sauce]",
                        "category.[breakfast cereals].[corn flakes]",
                        "category.[confectionery]",
                        "category.[bakery].[chocolate biscuits]",
                        "category.[fruit preserves].[apple jam]",
                        "category.[bakery].[apple cake]",
                        "category.[soups].[tomato soup]"
                    ]
                }
            }],
            measures: [{
                "uniqueName": "Revenue",
                "aggregation": "sum",
                "format": "2sfou03a"
            }]
        },
        conditions: [{
            formula: "#value < 2500",
            measure: "Revenue",
            format: {
                backgroundColor: "#df3800",
                color: "#FFFFFF"
            },
            isTotal: false
        }, {
            formula: "#value > 20000",
            measure: "Revenue",
            format: {
                backgroundColor: "#00A45A",
                color: "#FFFFFF"
            },
            isTotal: false
        }],
        formats: [{
            name: "2sfou03a",
            thousandsSeparator: ",",
            decimalSeparator: ".",
            decimalPlaces: 2,
            currencySymbol: "$",
            currencySymbolAlign: "left",
            nullValue: "",
            textAlign: "right",
            isPercent: false
        }]
    }
});