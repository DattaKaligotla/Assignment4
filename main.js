// when data type is changed
function onDataChanged() {
  let select = d3.select("#selectData").node();
  let value = select.options[select.selectedIndex].value;
  chartScales.x = domainChange(value);
  global(value);
  let temp = yValues();
  chartScales.y = temp;
  chartScales.value = value;
  loadChart();
}

// when country selected in changed
function onCountryChanged() {
  let select = document.getElementById("countryInput");
  chartScales.country = select.value;
  loadChart();
}

// gets values for x axis
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
  for (i = 0; i < valuesList.length; i++) {
    if (valuesList[i] === value) {
      return domains[i];
    }
  }
}

// sorts the globalSortedData with specified value
function global(value) {
  globalSortedData = [];
  globalData.forEach(e => {
    globalSortedData.push(filteredData(e, value));
  });
}

// gets min and max values for y axis
function yValues() {
  let a = [];
  globalSortedData.forEach(e => {
    e.values.forEach(v => {
       a.push(v[1]);     
    })
  });
  return d3.extent(a);
}

var svg = d3.select("svg");

var svgWidth = +svg.attr("width");
var svgHeight = +svg.attr("height");

var padding = { t: 40, r: 40, b: 40, l: 60 };

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

// loads json and updates chart with initial values
d3.json("assignment_4_dataset.json").then(function (data) {
  globalData = data;
  globalSortedData = [];
  global("gdp");

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

  let y = yValues();

  chartScales = {
    x: [2018, 2021],
    y: y,
    country: "United States",
    value: "gdp",
  };
  loadChart();
});

function filteredData(e, value) {
  let a = [];
  if (value === "gdp") {
    a.push([2018, e.gdp_2018]);
    a.push([2019, e.gdp_2019]);
    a.push([2020, e.gdp_2020]);
    a.push([2021, e.gdp_2021]);
  } else if (value === "gdp_per_capita") {
    a.push([2018, e.gdp_per_capita_2018]);
    a.push([2019, e.gdp_per_capita_2019]);
    a.push([2020, e.gdp_per_capita_2020]);
    a.push([2021, e.gdp_per_capita_2021]);
  } else if (value === "health_expenditure") {
    a.push([2014, e.health_expenditure_2014]);
    a.push([2015, e.health_expenditure_2015]);
    a.push([2016, e.health_expenditure_2016]);
    a.push([2017, e.health_expenditure_2017]);
    a.push([2018, e.health_expenditure_2018]);
    a.push([2019, e.health_expenditure_2019]);
    a.push([2020, e.health_expenditure_2020]);
    a.push([2021, e.health_expenditure_2021]);
    a.push([2022, e.health_expenditure_2021_or_later]);
  } else if (value === "health_expenditure_per_person") {
    a.push([2015, e.health_expenditure_per_person_2015]);
    a.push([2018, e.health_expenditure_per_person_2018]);
    a.push([2019, e.health_expenditure_per_person_2019]);
  } else if (value === "military") {
    let num1 = e.military_2019.slice(0, e.military_2019.length - 1);
    let num2 = e.military_2021.slice(0, e.military_2021.length - 1);
    a.push([2019, Number(num1)]);
    a.push([2021, Number(num2)]);
  } else if (value === "unemployment") {
    a.push([2018, e.unemployment_2018]);
    a.push([2021, e.unemployment_2021]);
  }
  return {country: e.country, values: a};
}

// creates the line
let lineGenerator = d3
  .line()
  .x(function (d) {
    return xScale(d[0]);
  })
  .y(function (d) {
    return yScale(d[1]);
  });

// creates and updates the chart
function loadChart() {

  yScale.domain(chartScales.y).nice();
  xScale.domain(chartScales.x).nice();

  xAxisG
  .transition()
  .duration(750)
    .call(
      d3
        .axisBottom(xScale)
        .ticks(chartScales.x[1] - chartScales.x[0])
        .tickFormat(d3.format(""))
    );
  yAxisG.transition().duration(750).call(d3.axisLeft(yScale));

  let line = chartG.selectAll(".line-path").data(globalSortedData);

  line.remove();

  line = chartG.selectAll(".line-path").data(globalSortedData);

  let lineEnter = line.enter()
  .append("g")
  .attr("class", "line-path");
 
  
  lineEnter.append("text")
    .attr("x", 200)
    .text(function (d) {
      return d.country;
    });
  
  lineEnter
    .append("path")
    .attr("id", function(d) {
      return d.country;
    })
    .attr("d", function (d) {
      return lineGenerator(d.values);
    })
    .attr("stroke", function(d) {
      if (d.country === chartScales.country) {
        return "orange";
      } else {
        return "#69b3a2";
      }
    })
    .attr("stroke-width", function(d) {
      if (d.country === chartScales.country) {
        return "3px";
      } else {
        return "1.5px";
      }
    })
    .attr("opacity", function(d) {
      if (d.country === chartScales.country) {
        return "1";
      } else {
        return "0.5";
      }
    });

  
}