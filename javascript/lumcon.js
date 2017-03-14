var dataByYear = {};

(function() {

// set the dimensions and margins of the graph
var margin = {top: 20, right: 40, bottom: 30, left: 50},
    width = 700 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tip")
  .style("position", "absolute")
  .style("z-index", "20")
  .style("top", "100px")
  .style("left", "100px");

// parse the date / time
//var parseTime = d3.timeParse("%m/%d/%y %H:%M"); // 10/29/08 0:30
var parseTime = d3.timeParse("%m/%d/%y"), 
    bisectDate = d3.bisector(function(d) { return d.date; }).left;

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y0 = d3.scaleLinear().range([height, 0]);
var y1 = d3.scaleLinear().range([height, 0]);

// define the 1st line
var valueline = d3.line()
    .curve(d3.curveCatmullRom.alpha(0.5))
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y0(d.discharge); });

// define the 2nd line
var valueline2 = d3.line()
    .curve(d3.curveCatmullRom.alpha(0.75))
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y1(d.gauge_height); });

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

$(document).ready(function(){
  $(".yrButton").on("mouseover",function(){
    if(!$(this).hasClass("clicked")) $(this).addClass("highlight")
  })
  $(".yrButton").on("mouseout",function(){
    if(!$(this).hasClass("clicked")) $(this).removeClass("highlight");
  })
  $(".yrButton").on("click",function(d){
    $( ".yrButton" ).each(function( index ) {
      if($(this).hasClass("highlight")) $(this).removeClass("highlight");
      if($(this).hasClass("clicked")) $(this).removeClass("clicked");
    });
    $(this).addClass("clicked");
    tmp = ($(this).text()).substring(($(this).text()).length-2,($(this).text()).length);
    updateYear(tmp)
  });
})

// Get the data
//d3.csv("data/msr_gauge_data.csv", function(error, data) {
d3.csv("data/averages.csv", function(error, data) {
  if (error) throw error;

  oldData = data;

  parseData(data);

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
    d.discharge = +d.discharge;
    d.gauge_height = +d.gauge_height;
    d.water_velocity = +d.water_velocity;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y0.domain([0, d3.max(data, function(d) {return Math.max(d.discharge);})]);
  y1.domain([0, d3.max(data, function(d) {return Math.max(d.gauge_height); })]);

  // Add the valueline path.
  svg.append("path")
    .attr("id","valueline1")
    .data([data])
    .style("stroke", "#225ea8")
    .style("stroke-width","2")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("d", valueline);

  // Add the valueline2 path.
  svg.append("path")
    .attr("id","valueline1")
    .data([data])
    .attr("class", "line")
    .style("stroke", "#41ab5d")
    .style("stroke-width","2")
    .attr("fill", "none")
    .attr("d", valueline2);

  // Add the X Axis
  svg.append("g")
    .attr("id","axis1")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add the Y0 Axis
  svg.append("g")
    .attr("id","axis1")
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
    .attr("id","axis1")
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

  var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus.append("circle")
      .attr("class","circle")
      .attr("r", 4.5);

  focus.append("text")
      .attr("class","focus-text")
      .attr("x", 9)
      .attr("dy", ".25em");

  var focus_2 = svg.append("g")
      .attr("class", "focus2")
      .style("display", "none");

  focus_2.append("circle")
      .attr("class","circle")
      .attr("r", 4.5);

  focus_2.append("text")
      .attr("class","focus-text")
      .attr("id","f2text")
      .attr("x", 9)
      .attr("dy", ".25em");

  var vertical = d3.select(".chart")
    .append("div")
    .attr("id","vertical")
    .attr("class", "remove")
    .style("position", "absolute")
    .style("z-index", "19")
    .style("width", "1px")
    .style("height", "310px")
    .style("top", "10px")
    .style("bottom", "30px")
    .style("left", "0px")
    .style("background", "black");

  d3.select(".chart")
    .on("mousemove", function(data){  
      var mousex = d3.mouse(this);
      mousex = mousex[0] + 5
      vertical.style("left", mousex + "px" )
    })

    .on("mouseover", function(){  
       mousex = d3.mouse(this);
       mousex = mousex[0] + 5;
       vertical.style("left", mousex + "px")
     });

  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { 
        focus.style("display", null); 
        focus_2.style("display", null)})
      .on("mouseout", function() { 
        focus.style("display", "none"); 
        focus_2.style("display", "none")})
      .on("mousemove", function(){
        var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        focus.attr("transform", "translate(" + x(d.date) + "," + y0(d.discharge) + ")");
        focus.select("text").text(Math.round(d.discharge * 100) / 100);
        focus_2.attr("transform", "translate(" + x(d.date) + "," + y1(d.gauge_height) + ")");
        focus_2.select("text").text(Math.round(d.gauge_height * 100) / 100);
        
      });


});

function updateYear(yr){
  d3.selectAll("#valueline1").remove();
  d3.selectAll("#axis1").remove();
  d3.selectAll(".overlay").remove();
  d3.selectAll("#vertical").remove();
  d3.selectAll(".focus-text").remove()
  d3.selectAll(".focus").remove()
  d3.selectAll(".circle").remove()
  
  if(yr === "ll") {
    data = oldData;
  } else {
    data = dataByYear[yr];
  }

  // Format the data
  data.forEach(function(d) {
    d.date = parseTime(d.datetime);
    d.discharge = +d.discharge;
    d.gauge_height = +d.gauge_height;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y0.domain([0, d3.max(data, function(d) {return Math.max(d.discharge);})]);
  y1.domain([0, d3.max(data, function(d) {return Math.max(d.gauge_height); })]);

  // Add the valueline path.
  svg.append("path")
    .attr("id","valueline1")
    .data([data])
    .style("stroke", "#225ea8")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("d", valueline);

  // Add the valueline2 path.
  svg.append("path")
    .attr("id","valueline1")
    .data([data])
    .attr("class", "line")
    .style("stroke", "#41ab5d")
    .style("stroke-width","2")
    .attr("fill", "none")
    .attr("d", valueline2);

  // Add the X Axis
  svg.append("g")
    .attr("id","axis1")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add the Y0 Axis
  svg.append("g")
    .attr("id","axis1")
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
    .attr("id","axis1")
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

  
  var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus.append("circle")
      .attr("class","circle")
      .attr("r", 4.5);

  focus.append("text")
      .attr("class","focus-text")
      .attr("x", 9)
      .attr("dy", ".35em");

  var focus_2 = svg.append("g")
      .attr("class", "focus2")
      .style("display", "none");

  focus_2.append("circle")
      .attr("class","circle")
      .attr("r", 4.5);

  focus_2.append("text")
      .attr("class","focus-text")
      .attr("id","f2text")
      .attr("x", 9)
      .attr("dy", ".35em");

  var vertical = d3.select(".chart")
    .append("div")
    .attr("id","vertical")
    .attr("class", "remove")
    .style("position", "absolute")
    .style("z-index", "19")
    .style("width", "1px")
    .style("height", "310px")
    .style("top", "10px")
    .style("bottom", "30px")
    .style("left", "0px")
    .style("background", "black");

  d3.select(".chart")
    .on("mousemove", function(data){  
      var mousex = d3.mouse(this);
      mousex = mousex[0] + 5;
      vertical.style("left", mousex + "px" )})

    .on("mouseover", function(){  
       mousex = d3.mouse(this);
       mousex = mousex[0] + 5;
       vertical.style("left", mousex + "px")});

  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { 
        focus.style("display", null); 
        focus_2.style("display", null)})
      .on("mouseout", function() { 
        focus.style("display", "none"); 
        focus_2.style("display", "none")})
      .on("mousemove", function(){
        var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y0(d.discharge) + ")");
        focus.select("text").text(Math.round(d.discharge * 100) / 100);
        focus_2.attr("transform", "translate(" + x(d.date) + "," + y1(d.gauge_height) + ")");
        focus_2.select("text").text(Math.round(d.gauge_height * 100) / 100);

      });


}

function parseData(data) {
  var dates = {}, results = [];
  for (var i = 0 ; i < data.length ; i++) {
    arr = (data[i]["datetime"]).split(" ");
    if(dates[arr[0]]) {
      dates[arr[0]]["discharge"].push(parseFloat(data[i]["discharge"]));
      dates[arr[0]]["gauge_height"].push(parseFloat(data[i]["gauge_height"]));
      dates[arr[0]]["water_velocity"].push(parseFloat(data[i]["water_velocity"]));
    } else {
      dates[arr[0]] = {"discharge":[parseFloat(data[i]["discharge"])],
        "gauge_height":[parseFloat(data[i]["gauge_height"])],
        "water_velocity":[parseFloat(data[i]["water_velocity"])]};
    }
  }

  csvData = [["datetime","discharge","gauge_height","water_velocity"]];

  for(let date of Object.keys(dates)) {
    var discharge = average(dates[date]["discharge"]);
    var gauge_height = average(dates[date]["gauge_height"]);
    var water_velocity = average(dates[date]["water_velocity"]);
    if(!isNaN(discharge) && !isNaN(gauge_height) && !isNaN(water_velocity)) {
        csvData.push([date,discharge,gauge_height,water_velocity]);
    }
  }

  var csvContent = "data:text/csv;charset=utf-8,";
  csvData.forEach(function(infoArray, index){
    if(!contains("NaN",infoArray)) {
      dataString = infoArray.join(",");
      csvContent += index < csvData.length ? dataString+ "\n" : dataString;
    }
  }); 

  // var encodedUri = encodeURI(csvContent);
  // window.open(encodedUri);=

  return results;
}


})();


/* Ratios of Gage Height / Discharge */


(function() {

// set the dimensions and margins of the graph
var margin = {top: 20, right: 40, bottom: 30, left: 50},
    width = 700 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

var parseTime = d3.timeParse("%m/%d/%y"),
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    dataByYear2 = {}, oldData;

// set the ranges
var x2 = d3.scaleTime().range([0, width]);
var y02 = d3.scaleLinear().range([height, 0]);

// define the 1st line
var valueline2 = d3.line()
    .curve(d3.curveCatmullRom.alpha(0.5))
    .x(function(d) { return x2(d.date); })
    .y(function(d) { return y02(d.ratio); });


var svg2 = d3.select(".ratios").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

$(document).ready(function(){
  $(".yrButton2").on("mouseover",function(){
    if(!$(this).hasClass("clicked")) $(this).addClass("highlight")
  })
  $(".yrButton2").on("mouseout",function(){
    if(!$(this).hasClass("clicked")) $(this).removeClass("highlight");
  })
  $(".yrButton2").on("click",function(d){
    $( ".yrButton2" ).each(function( index ) {
      if($(this).hasClass("highlight")) $(this).removeClass("highlight");
      if($(this).hasClass("clicked")) $(this).removeClass("clicked");
    });
    $(this).addClass("clicked");
    tmp = ($(this).text()).substring(($(this).text()).length-2,($(this).text()).length);
    updateYear2(tmp,oldData);
  });
})


d3.csv("data/averages.csv", function(error, data) {
  if (error) throw error;

  oldData = data;

  for(let entry of data) {
    var datetime = entry.datetime, yr;
    datetime = datetime.split(" ");
    datetime = datetime[0].split("/");
    yr = datetime[2];
    if(dataByYear2[yr]) {
      dataByYear2[yr].push(entry);
    } else {
      dataByYear2[yr]=[entry];
    }
  }

  data = dataByYear2["08"];

  // format the data
  data.forEach(function(d) {
    d.date = parseTime(d.datetime);
    d.discharge = +d.discharge;
    d.gauge_height = +d.gauge_height;
    d.water_velocity = +d.water_velocity;
    d.ratio = +(parseFloat(d.discharge / d.gauge_height));
  });

  // Scale the range of the data
  x2.domain(d3.extent(data, function(d) { return d.date; }));
  y02.domain([0, d3.max(data, function(d) {return Math.max(d.ratio);})]);

  // Add the valueline path.
  svg2.append("path")
    .attr("id","valueline2")
    .data([data])
    .style("stroke", "#225ea8")
    .style("stroke-width","2")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("d", valueline2);

  // Add the X Axis
  svg2.append("g")
    .attr("id","axis2")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x2));

  // Add the Y0 Axis
  svg2.append("g")
    .attr("id","axis2")
    .attr("class", "axisSteelBlue")
    .call(d3.axisLeft(y02))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Discharge / Gage Height (feet^2 / s)");

  var focus2 = svg2.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus2.append("circle")
      .attr("class","circle")
      .attr("r", 4.5);

  focus2.append("text")
      .attr("class","focus-text")
      .attr("x", 9)
      .attr("dy", ".35em");



  var vertical2 = d3.select(".ratios")
    .append("div")
    .attr("id","vertical2")
    .attr("class", "remove")
    .style("position", "absolute")
    .style("z-index", "19")
    .style("width", "1px")
    .style("height", "310px")
    .style("top", "10px")
    .style("bottom", "30px")
    .style("left", "0px")
    .style("background", "black");

  d3.select(".ratios")
    .on("mousemove", function(data){  
      var mousex = d3.mouse(this);
      mousex = mousex[0] + 5;
      vertical2.style("left", mousex + "px" )})

    .on("mouseover", function(){  
       mousex = d3.mouse(this);
       mousex = mousex[0] + 5;
       vertical2.style("left", mousex + "px")});

  svg2.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus2.style("display", null); })
      .on("mouseout", function() { focus2.style("display", "none"); })
      .on("mousemove", function(){
        var x0 = x2.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus2.attr("transform", "translate(" + x2(d.date) + "," + y02(d.ratio) + ")");
        focus2.select("text").text(Math.round(d.ratio * 100) / 100);
      });




});

function updateYear2(yr,oldData){
  d3.selectAll("#valueline2").remove();
  d3.selectAll("#axis2").remove();
  d3.selectAll("#vertical2").remove();

  if(yr === "ll") {
    data = oldData;
  } else {
    data = dataByYear[yr];
  }

  // Format the data
  data.forEach(function(d) {
    d.date = parseTime(d.datetime);
    d.discharge = +d.discharge;
    d.gauge_height = +d.gauge_height;
    d.ratio = +(parseFloat(d.discharge / d.gauge_height)); 
  });

  // Scale the range of the data
  x2.domain(d3.extent(data, function(d) { return d.date; }));
  y02.domain([0, d3.max(data, function(d) {return Math.max(d.ratio);})]);

  // Add the valueline path.
  svg2.append("path")
    .attr("id","valueline2")
    .data([data])
    .style("stroke", "#225ea8")
    .style("stroke-width","2")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("d", valueline2);

  // Add the X Axis
  svg2.append("g")
    .attr("id","axis2")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x2));

  // Add the Y0 Axis
  svg2.append("g")
    .attr("id","axis2")
    .attr("class", "axisSteelBlue")
    .call(d3.axisLeft(y02))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Discharge / Gage Height (feet^2 / s)");

    var focus2 = svg2.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus2.append("circle")
      .attr("class","circle")
      .attr("r", 4.5);

  focus2.append("text")
      .attr("class","focus-text")
      .attr("x", 9)
      .attr("dy", ".35em");

  var vertical2 = d3.select(".ratios")
    .append("div")
    .attr("id","vertical2")
    .attr("class", "remove")
    .style("position", "absolute")
    .style("z-index", "19")
    .style("width", "1px")
    .style("height", "310px")
    .style("top", "10px")
    .style("bottom", "30px")
    .style("left", "0px")
    .style("background", "black");

  d3.select(".ratios")
    .on("mousemove", function(data){  
      var mousex = d3.mouse(this);
      mousex = mousex[0] + 5;
      vertical2.style("left", mousex + "px" )})

    .on("mouseover", function(){  
       mousex = d3.mouse(this);
       mousex = mousex[0] + 5;
       vertical2.style("left", mousex + "px")});

  svg2.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus2.style("display", null); })
      .on("mouseout", function() { focus2.style("display", "none"); })
      .on("mousemove", function(){
        var x0 = x2.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus2.attr("transform", "translate(" + x2(d.date) + "," + y02(d.ratio) + ")");
        focus2.select("text").text(Math.round(d.ratio * 100) / 100);
      });

}



})();



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

function average(arr) {
  var sum = 0;
  var rem = 0
  for( var i = 0; i < arr.length; i++ ){
    if(!isNaN(parseFloat(arr[i],100))) {
      sum += parseFloat( arr[i], 10 ); 
    } else {
      rem++;
    }
  }
  return sum/(arr.length-rem);
}









