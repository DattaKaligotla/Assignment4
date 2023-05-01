function onDataChanged() {
  let select = d3.select("#selectData").node();
  let value = select.options[select.selectedIndex].value;
  chartScales.x = domainChange(value);
  updateChart();
}

function onCountryChanged() {
  let select = document.getElementById("countryInput");
  chartScales.country = select.value;
  updateChart();
}

function domainChange(value) {
  let valuesList = [
    "gdp",
    "gdp_per_capita",
    "health_expenditure",
    "health_expenditure_per_person",
    "military",
    "unemployment",
  ];
  let domains = [
    [2018, 2021],
    [2018, 2021],
    [2014, 2022],
    [2015, 2019],
    [2019, 2021],
    [2018, 2021],
  ];
  let i;
  for (i = 0;i<valuesList.length;i++) {
    if (valuesList[i] === value) {
      return domains[i];
    }
  }
}

function yValues(data, value, range) {
  let a = [];
  let i;
  data.forEach(e => {
    
  });
}

var svg = d3.select("svg");

var svgWidth = +svg.attr("width");
var svgHeight = +svg.attr("height");

var padding = { t: 40, r: 40, b: 40, l: 40 };

var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

var chartG = svg
  .append("g")
  .attr("transform", "translate(" + [padding.l, padding.t] + ")");

var xAxisG = chartG
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(" + [0, chartHeight] + ")");
var yAxisG = chartG.append("g").attr("class", "y axis");


d3.json("assignment_4_dataset.json").then(function (data) {
  xScale = d3.scaleLinear().range([0, chartWidth]);
  yScale = d3.scaleLinear().range([chartHeight, 0]);

  let countryList = document.getElementById("countryList");
  let temp;
  data.forEach((e) => {
    temp = document.createElement("option");
    temp.value = e.country;
    temp.innerHTML = e.country;
    return countryList.appendChild(temp);
  });

  domainMap = [];



  chartScales = { x: [2018,2021], country: "United States", value: "gdp"};
  updateChart();
});

function updateChart() {}
