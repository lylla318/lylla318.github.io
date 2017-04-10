/* Get the instance data from the json file. */

var attack_sites = [], total = 0;

var margin = {top: 10, left: 10, bottom: 10, right: 10},
    width = parseInt(d3.select('#viz').style('width')),
    width = width - margin.left - margin.right,
    mapRatio = .7,
    centered,
    r = 40;
    height = width * mapRatio,
    mapRatioAdjuster = 5; // adjust map ratio here without changing map container size.
    syria_center = [38, 35]; // Syria's geographical center

//Define map projection
var projection = d3.geo.mercator()
     .center(syria_center) // sets map center to Syria's center
     .translate([width/2, height/2])
     .scale(width * [mapRatio + mapRatioAdjuster]);

// adjust map size when browser window size changes
function resize() {
    svg.selectAll("circle").remove();

    var features = svg.append("g");

    width = parseInt(d3.select('#viz').style('width'));
    width = width - margin.left - margin.right;
    height = width * mapRatio;

    // update projection
    projection.translate([width / 2, height / 2])
      .center(syria_center)
      .scale(width * [mapRatio + mapRatioAdjuster]);

    // resize map container
    svg.style('width', width + 'px')
      .style('height', height + 'px');

    // resize map
    svg.selectAll("path")
      .attr('d', path);
}

// when window size changes, resize the map
d3.select(window).on('resize', resize);

// create SVG element
var svg = d3.select("#viz")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

//Define path generator
var path = d3.geo.path()
    .projection(projection);

//Group SVG elements together
var features = svg.append("g");


//Load TopoJSON data
d3.json("data/syria-districts-topojson.json", function(error, syr) {

  if (error) return console.error(error);

  queue()
    .defer(d3.csv, "data/russian_attacks.csv")
    .awaitAll(function(error, results) { 
      var attacksByDay = parseAttacks(results);
      playAttacks(attacksByDay);
    });

  function parseAttacks(results) {

    var attacksByDay = {};

    for(var i = 0 ; i < results.length ; i++) {
      for(var j = 0 ; j < results[i].length ; j++) {
        if(results[i][j].location_latitude != "" && results[i][j].location_longitude != ""){
          var longitude = parseFloat(results[i][j].location_longitude);
          var latitude = parseFloat(results[i][j].location_latitude);
          var coords = [longitude, latitude, results[i][j]];
          attack_sites.push(coords);
        }
      }
    }

    for (var i = 0 ; i < attack_sites.length ; i++) {
      var date = ((attack_sites[i][2]).recording_date).split(" ");
      date = date[0];
      if(attacksByDay[date]) {
        (attacksByDay[date]).push(attack_sites[i][2]);
      } else {
        attacksByDay[date] = [attack_sites[i][2]];
      }
    }
    
    return attacksByDay;
  }

  function playAttacks(attacksByDay) {
    var subunits = topojson.feature(syr, syr.objects.SYR_adm2);

    // Bind data and create one path per TopoJSON feature
    features.selectAll("path")
      .data(topojson.feature(syr, syr.objects.SYR_adm2).features)
      .enter()
      .append("path")
      .attr("d", path)

      // Sets colors of fill and stroke for each district. Sets stroke width, too.
      //.attr("fill", "#e8d8c3")
      .attr("fill", "#080808")
      //.attr("stroke", "#404040")
      .attr("stroke", "#ddd")
      .attr("stroke-width", .3)

    var time1 = 1, attackDay = 0;
    var interval1 = setInterval(function() { 
      if (time1 <= (Object.keys(attacksByDay)).length) { 
        var date = (Object.keys(attacksByDay))[attackDay];
        $(".date").empty();
        $(".date").append(date);
        var dayData = (attacksByDay[((Object.keys(attacksByDay))[attackDay])]);
        var time2 = 0, k = 0;
        var interval2 = setInterval(function(){
          if (time2 <= dayData.length-1) {

            var loc = ((((dayData[time2]).location).split(" "))[0]).toLowerCase();
            var amt = parseInt(($("#"+loc)).text());
            amt++;
            total ++;
            $("#"+loc).empty();
            $("#"+loc).append(amt);
            $("#total").empty();
            $("#total").append(total); 

            if(loc != "aleppo" && loc != "idlib" && loc != "hama" && loc != "daraa" && loc != "damascus" && loc != "lattakia" && loc != "homs") {
              console.log(loc);
            }           

            var longitude = parseFloat(dayData[k].location_longitude),
                latitude = parseFloat(dayData[k].location_latitude),
                attackCoords = projection([longitude, latitude]);

            var circle = svg.append("circle")
              .attr("class",".circ"+attackDay)
              .data([(Object.keys(attacksByDay))[attackDay]])
              .attr("cx", attackCoords[0])
              .attr("cy", attackCoords[1])
              .attr("r", 0)
              .style("stroke-width", 5 / (1))
              .transition()
                  .delay(Math.pow(1, 2.5) * 10)
                  .duration(300)
                  .ease('quad-in')
              .attr("r", r)
              .style("stroke-opacity", 0)
              .each("end", function () {
                  d3.select(".circ"+attackDay).remove();
              });
            k++;
            time2++;
          } else {
            clearInterval(interval2);
          }
        }, 1000/dayData.length);
        attackDay++;
        time1++;
      }
      else { 
         clearInterval(interval1);
      }
    }, 1000);
  }

});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}





