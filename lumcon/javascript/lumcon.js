
//toggle down disorderToggle hover-underline

// set the dimensions and margins of the graph
var margin = {top: 20, right: 40, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%m/%d/%y %H:%M"); // 10/29/08 0:30

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y0 = d3.scaleLinear().range([height, 0]);
var y1 = d3.scaleLinear().range([height, 0]);

// define the 1st line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y0(d.discharge); });

// define the 2nd line
var valueline2 = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y1(d.gauge_height); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#vis").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data/msr_gauge_data.csv", function(error, data) {
  if (error) throw error;

  dataByYear = {};

  for(let entry of data) {
    var datetime = entry.datetime, yr;
    datetime = datetime.split(" ");
    datetime = datetime[0].split("/");
    yr = datetime[2];
    if(dataByYear[yr]) {
      dataByYear[yr].push(entry);
    } else {
      dataByYear[yr]=[entry];
    }
  }

  data = dataByYear["08"];

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.datetime);
      d.close = +d.discharge;
      d.open = +d.gauge_height;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y0.domain([0, d3.max(data, function(d) {return Math.max(d.close);})]);
  y1.domain([0, d3.max(data, function(d) {return Math.max(d.open); })]);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .style("stroke", "#225ea8")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("d", valueline);

  // Add the valueline2 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "#41ab5d")
      .attr("fill", "none")
      .attr("d", valueline2);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y0 Axis
  svg.append("g")
      .attr("class", "axisSteelBlue")
      .call(d3.axisLeft(y0))
        .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Discharge (cubic feet / s)");

  // Add the Y1 Axis
  svg.append("g")
      .attr("class", "axisGreen")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisRight(y1))
        .append("text")
          .attr("fill", "#000")
          .attr("transform", "translate( " + 20 + ", 0 )rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Gage Height (feet)");

});


function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

truncateDecimals = function (number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};






