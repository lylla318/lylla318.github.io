var sample_data = {"Germany":{"coauthors":440,"count":"eudeu"},"China":{"coauthors":325,"count":"aschn"},"United Kingdom":{"coauthors":291,"count":"eugbr"},"France":{"coauthors":224,"count":"eufra"},"South Korea":{"coauthors":216,"count":"askor"},"Taiwan":{"coauthors":145,"count":"astwn"},"Italy":{"coauthors":139,"count":"euita"},"Japan":{"coauthors":134,"count":"asjpn"},"Canada":{"coauthors":126,"count":"nacan"},"Switzerland":{"coauthors":123,"count":"euche"},"Australia":{"coauthors":120,"count":"ocaus"},"Netherlands":{"coauthors":114,"count":"eunld"},"Chile":{"coauthors":89,"count":"aschl"},"Greece":{"coauthors":75,"count":"eugrc"},"Spain":{"coauthors":75,"count":"euesp"},"Russia":{"coauthors":74,"count":"asrus"},"Singapore":{"coauthors":73,"count":"assgp"},"Denmark":{"coauthors":70,"count":"eudnk"},"Israel":{"coauthors":62,"count":"asisr"},"Czech Republic":{"coauthors":61,"count":"eucze"},"Argentina":{"coauthors":49,"count":"saarg"},"India":{"coauthors":48,"count":"asind"},"Saudi Arabia":{"coauthors":46,"count":"assau"},"Brazil":{"coauthors":41,"count":"sabra"},"Norway":{"coauthors":38,"count":"eunor"},"Belgium":{"coauthors":32,"count":"eubel"},"Peru":{"coauthors":24,"count":"saper"},"Slovenia":{"coauthors":22,"count":"eusvn"},"New Zealand":{"coauthors":21,"count":"ocnzl"},"Sweden":{"coauthors":18,"count":"euswe"},"Turkey":{"coauthors":18,"count":"astur"},"Austria":{"coauthors":16,"count":"euaut"},"Finland":{"coauthors":15,"count":"eufin"},"Mexico":{"coauthors":12,"count":"samex"},"Thailand":{"coauthors":12,"count":"astha"},"Malaysia":{"coauthors":9,"count":"asmys"},"Bolivia":{"coauthors":7,"count":"eubol"},"Colombia":{"coauthors":7,"count":"sacol"},"Uganda":{"coauthors":6,"count":"afuga"},"Iceland":{"coauthors":5,"count":"euisl"},"Panama":{"coauthors":5,"count":"napan"},"Portugal":{"coauthors":5,"count":"euprt"},"South Africa":{"coauthors":5,"count":"afzaf"},"Costa rica":{"coauthors":4,"count":"nacri"},"Ethiopia":{"coauthors":4,"count":"afeth"},"Ireland":{"coauthors":4,"count":"euirl"},"Lithuania":{"coauthors":4,"count":"eultu"},"Qatar":{"coauthors":4,"count":"asqat"},"Venezuela":{"coauthors":4,"count":"saven"},"Iran":{"coauthors":3,"count":"asirn"},"Morocco":{"coauthors":3,"count":"afmar"},"Algeria":{"coauthors":2,"count":"afdza"},"Cote Ivoire":{"coauthors":2,"count":"afciv"},"Hungary":{"coauthors":2,"count":"euhun"},"Indonesia":{"coauthors":2,"count":"asidn"},"Kenya":{"coauthors":2,"count":"afken"},"Libya":{"coauthors":2,"count":"aflby"},"Philippines":{"coauthors":2,"count":"asphl"},"Sri lanka":{"coauthors":2,"count":"aslka"},"Surinam":{"coauthors":2,"count":"sasur"},"Uruguay":{"coauthors":2,"count":"saury"},"Cameroon ":{"coauthors":1,"count":"afcmr"},"Croatia":{"coauthors":1,"count":"euhrv"},"Guatemala":{"coauthors":1,"count":"nagtm"},"Guinea":{"coauthors":1,"count":"afgin"},"Honduras":{"coauthors":1,"count":"nahnd"},"Lebanon":{"coauthors":1,"count":"aslbn"},"Mauritania":{"coauthors":1,"count":"afmrt"},"Nepal":{"coauthors":1,"count":"asnpl"},"Nicaragua":{"coauthors":1,"count":"nanic"},"Oman":{"coauthors":1,"count":"asomn"},"Poland":{"coauthors":1,"count":"eupol"},"Serbia":{"coauthors":1,"count":"eusrb"},"Sierra Leone":{"coauthors":1,"count":"afsle"},"Ukraine":{"coauthors":1,"count":"euukr"}};

var selectColor = "#9999cc",

    current, 

    currentData = [],

    filteredData = [],

    worldMap = true,

    currentColorScheme = "warm",

    clicked = false,

    worldData = {},
  
    usaData = {},

    initialized = false;

    noCoauthors = [], currentRange = [], removedNames = [], currentAffiliations = [], removedAffiliations = [];

var stateHashMap = {"Hawaii":"HI", "Alaska":"AK", "Florida":"FL", "South Carolina":"SC", "Georgia":"GA", "Alabama":"AL", 
        "North Carolina":"NC", "Tennessee":"TN", "Rhode Island":"RI", "Connecticut":"CT", "Massachusetts":"MA",
        "Maine":"ME", "New Hampshire":"NH", "Vermont":"VT", "New York":"NY", "New Jersey":"NJ", "Pennsylvania":"PA", 
        "Delaware":"DE", "Maryland":"MD", "West Virginia":"WV", "Kentucky":"KY", "Ohio":"OH", "Michigan":"MI", 
        "Wyoming":"WY", "Montana":"MT", "Idaho":"ID", "Washington":"WA", "District of Columbia":"DC", "Texas":"TX", "California":"CA", 
        "Arizona":"AZ", "Nevada":"NV", "Utah":"UT", "Colorado":"CO", "New Mexico":"NM", "Oregon":"OR", "North Dakota":"ND", 
        "South Dakota":"SD", "Nebraska":"NE", "Iowa":"IA", "Mississippi":"MS", "Indiana":"IN", "Illinois":"IL", "Minnesota": "MN", 
        "Wisconsin":"WI", "Missouri":"MO", "Arkansas":"AR", "Oklahoma":"OK", "Kansas":"KS", "Louisiana":"LA", "Virginia":"VA", "Puerto Rico":"PR"};


for (var i=0 ; i < (Object.keys(sample_data)).length ; i++) {
  noCoauthors.push( sample_data[(Object.keys(sample_data))[i]].coauthors);
}

noCoauthors.sort(function(a, b){return a-b});

$(document).ready(function(){

  d3.json("data/external-collaborations.json", function(error, results) {
  //d3.json("data/test.json", function(error, results) {
    currentData = results;
    setData();
    var keys = Object.keys(sample_data);
    for (var i = 0 ; i < keys.length ; i++) {
      sample_data[keys[i]].coauthors = 0;
    }
    var stateKeys = Object.values(stateHashMap);
    for(var i = 0 ; i < stateKeys.length ; i++) {
      usaData[stateKeys[i]] = {"coauthors": 0};
    }
    for(var i = 0 ; i < results.length ; i++) {
      var authors = results[i].authors;
      for(var j = 0 ; j < authors.length ; j++) {
        if(authors[j].state) {
          var state = authors[j].state;
          if(usaData[state]) {
            (usaData[state]).coauthors = (usaData[state]).coauthors + 1;
          } else {
            usaData[state] = {"coauthors": 1};
          }
        } else {
          if(authors[j].country) {
            var country = ((authors[j].country).toLowerCase()).trim();
            country = capitalizeFirstLetter(country);
            if(sample_data[country]) {
              sample_data[country].coauthors = sample_data[country].coauthors + 1;
            }
          }
        }
      }
    }
    initialize();
    function initialize() {
      if(!initialized) {
        $("input:radio:first").click();
        initialized = true;
      }
    }
    drawWorld();
  });

  $("input:radio[name=editList]").click(function() {
      if(initialized) {
        var value = $(this).val();
        if(worldMap) {
          worldMap = false;
          drawUSA();
        } else {
          worldMap = true;
          drawWorld();
        }
      }
  });

  $("#rh-panel").hide();

  $("#rh-panel").click(function(e){
    e.preventDefault();
    /* If rh-panel is open, minimize it. */
    if(!($("#rh-panel").hasClass("closed"))){
      $("#rh-panel").empty();
      $("#rh-panel").append("<div id='rh-panel-header-closed'><h4><span class='glyphicon glyphicon-th-list'></span></h4></div>");
      $("#rh-panel").animate({"width": "50px"},500);
      $("#rh-panel").addClass("closed");
    }
    /* Enlarge the rh-panel */
    else {
      getAuthorData(currentData, current);
      $("#rh-panel").animate({"width": "250px"},500);
      $("#rh-panel").removeClass("closed");
    }
  });

  $("#colorButton").click(function(){
    if(currentColorScheme == "cold") {
      currentColorScheme = "warm";
      colors = warmColorScheme;
      colorMap = warmColorMap;
    } else {
      currentColorScheme = "cold";
      colors = coldColorScheme;
      colorMap = coldColorMap;
    }

    if(worldMap) {
      d3.selectAll(".ctry").style("fill", function(d){
        if(sample_data[d.properties.name]) {
          var numCoauthors = (sample_data[d.properties.name]).coauthors;
          return getFill(numCoauthors, noCoauthors,colors);
        } else {
          return getFill(0, noCoauthors,colors);
        }
      });
    } else {
      d3.selectAll(".state").style("fill", function(d){
        var abbrev = stateHashMap[d.properties.name];
          if(usaData[abbrev]) {
            var numCoauthors = (usaData[abbrev]).coauthors;
            return getFill(numCoauthors, noCoauthors,colors);
          } else {
            return getFill(0, noCoauthors,colors);
          }
      });
    }
    

    $(".legend").remove();

    var legend = z.selectAll(".legend")
    .data(["0", "50", "100", "150", "200", "250", "300", "350", "351+"])
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { 
        return "translate(" + i * 2 + "0)"; })
      .style("font", "8px sans-serif");

    legend.append("rect")
      .attr("class","legend-box")
      .attr("x", width - 15)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", function(d){ return colorMap[d]; });

    legend.append("text")
      .attr("x", width-10)
      .attr("y", 30)
      .attr("dy", ".35em")
      .attr("text-anchor", "center")
      .attr("class", "legend-text")
      .style("fill", "#0A0A0A")
      .text(function(d) { return d; });

  });
});

var colors = ['#fed976','#ffcc33','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'],

    warmColorScheme = ['#fed976','#ffcc33','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'],

    coldColorScheme = ['#e0f3db','#ccebc5','#a8ddb5','#7bccc4','#4eb3d3','#2b8cbe','#0868ac','#084081'];

var colorMap = {"0":"#ddd" ,"50":"#fed976", "100":"#ffcc33", "150":"#feb24c", "200":"#fd8d3c", "250":"#fc4e2a", "300":"#e31a1c", "350":"#bd0026", "351+":"#800026"},

    warmColorMap = {"0":"#ddd" ,"50":"#fed976", "100":"#ffcc33", "150":"#feb24c", "200":"#fd8d3c", "250":"#fc4e2a", "300":"#e31a1c", "350":"#bd0026", "351+":"#800026"},

    coldColorMap = {"0":"#ddd" ,"50":"#e0f3db", "100":"#ccebc5", "150":"#a8ddb5", "200":"#7bccc4", "250":"#4eb3d3", "300":"#2b8cbe", "350":"#0868ac", "351+":"#084081"};

var colorBar = d3.select("#colorBar").append("svg")
    .attr("width", colorBarWidth)
    .attr("height", colorBarHeight);

var z = colorBar.append("g").attr("transform", "translate(" + (-900) + "," + 50 + ")"),
    colorBarWidth = 200,
    colorBarHeight = 100,
    width = 938,
    height = 500;

var legend = z.selectAll(".legend")
.data(["0", "50", "100", "150", "200", "250", "300", "350", "351+"])
.enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { 
    return "translate(" + i * 2 + "0)"; })
  .style("font", "8px sans-serif");

legend.append("rect")
  .attr("class","legend-box")
  .attr("x", width - 15)
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", function(d){ return colorMap[d]; });

legend.append("text")
  .attr("x", width-10)
  .attr("y", 30)
  .attr("dy", ".35em")
  .attr("text-anchor", "center")
  .attr("class", "legend-text")
  .style("fill", "#0A0A0A")
  .text(function(d) { return d; });

colorBar.append("text")
    .attr("x", 25)
    .attr("y", 20)
    .attr("dy", ".35em")
    .text("Color Scheme");

var m_width = $("#map").width();
    
function updateMapData() {
  console.log("update map data");
  var results = currentData;
  var keys = Object.keys(sample_data);
  for (var i = 0 ; i < keys.length ; i++) {
    sample_data[keys[i]].coauthors = 0;
  }
  var stateKeys = Object.values(stateHashMap);
  for(var i = 0 ; i < stateKeys.length ; i++) {
    usaData[stateKeys[i]] = {"coauthors": 0};
  }
  for(var i = 0 ; i < results.length ; i++) {
    var authors = results[i].authors;
    for(var j = 0 ; j < authors.length ; j++) {
      if(authors[j].state) {
        var state = authors[j].state;
        if(usaData[state]) {
          (usaData[state]).coauthors = (usaData[state]).coauthors + 1;
        } else {
          usaData[state] = {"coauthors": 1};
        }
      } else {
        if(authors[j].country) {
          var country = ((authors[j].country).toLowerCase()).trim();
          country = capitalizeFirstLetter(country);
          if(sample_data[country]) {
            sample_data[country].coauthors = sample_data[country].coauthors + 1;
          }
        }
      }
    }
  }
  if(worldMap) {
    drawWorld();
  } else {
    drawUSA();
  }
}

function drawWorld() {
  console.log("draw world");
  console.log("----------------------------------------------------------------------")
  $("#map").empty();

  var tooltip = d3.select("#map").append("div").attr("class", "tooltip hidden");

  var country, state;

  var projection = d3.geo.mercator()
    .scale(130)
    .translate([(width / 2)+30, height / 1.5]);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select("#map").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", m_width)
    .attr("height", m_width * height / width);

  svg.append("rect")
    .attr("class", "background")
    .attr("id", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", country_clicked);

  var g = svg.append("g");

  d3.json("json/countries.topo.json", function(error, us) {
    g.append("g")
      .attr("id", "countries")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.countries).features)
      .enter()
      .append("path")
      .attr("id", function(d) { return d.id; })
      .attr("class", "ctry")
      .attr("d", path)
      .style("fill", function(d, i) {
          if(sample_data[d.properties.name]) {
            var numCoauthors = (sample_data[d.properties.name]).coauthors;
            return getFill(numCoauthors, noCoauthors,colors);
          } else {
            return getFill(0, noCoauthors,colors);
          }
        })
      .on("mousemove", function(d,i) {
        d3.select(this).style("fill", "#66C2FF"); //"#9999cc"
        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
        tooltip
          .classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+300/*+offsetL*/)+"px;top:"+(mouse[1]+200/*+offsetT*/)+"px")
          .html(d.properties.name + "<br>" + "Co-authorships: " + getCoauthors(d.properties.name))
      })
      .on("mouseout",  function(d,i) {
        if(1) {
          d3.select(this).style("fill", function(d,i) {
            if(sample_data[d.properties.name]) {
              var numCoauthors = (sample_data[d.properties.name]).coauthors;
              return getFill(numCoauthors, noCoauthors,colors);
            } else {
              return getFill(0, noCoauthors,colors);
            }
          })
        }
        tooltip.classed("hidden", true);
      })
      .on("click", country_clicked);
  });

  function zoom(xyz) {
    g.transition()
      .duration(750)
      .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
      .selectAll(["#countries", "#states", "#cities"])
      .style("stroke-width", 1.0 / xyz[2] + "px")
      .selectAll(".city")
      .attr("d", path.pointRadius(20.0 / xyz[2]));
  }

  function get_xyz(d) {
    var bounds = path.bounds(d);
    var w_scale = (bounds[1][0] - bounds[0][0]) / width;
    var h_scale = (bounds[1][1] - bounds[0][1]) / height;
    var z = .96 / Math.max(w_scale, h_scale);
    var x = (bounds[1][0] + bounds[0][0]) / 2;
    var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
    return [x, y, z];
  }

  function country_clicked(d) {
    if(!d) {
      if(!($("#rh-panel").hasClass("closed"))){
        $("#rh-panel").empty();
        $("#rh-panel").append("<div id='rh-panel-header'>" + "<h4><span class='glyphicon glyphicon-th-list'></span></h4>" + "</div>");
        $("#rh-panel").animate({"width": "50px"},500);
        $("#rh-panel").addClass("closed");
      } 
    }
    g.selectAll(["#states", "#cities"]).remove();
    state = null;

    if (country) {
      g.selectAll("#" + country.id).style('display', null);
    }

    if (d && country !== d) {
      var xyz = get_xyz(d);
      country = d;
    } else {
      var xyz = [width / 2, height / 1.5, 1];
      country = null;
      //zoom(xyz);
    }
    if(!(d3.select(this)).classed("background")) {
      d3.selectAll(".clicked").classed("clicked", false);
      d3.select(this).classed("clicked", true);
      current = d.properties.name;
      getAuthorData(currentData, d.properties.name);
      $("#rh-panel").show();
      $("#rh-panel").removeClass("closed");
    }
  }

  $(window).resize(function() {
    var w = $("#map").width();
    svg.attr("width", w);
    svg.attr("height", w * height / width);
  });

}

function drawUSA() {
  $("#map").empty();

  $("#rh-panel").empty();
  $("#rh-panel").append("<div id='rh-panel-header-closed'><h4><span class='glyphicon glyphicon-th-list'></span></h4></div>");
  $("#rh-panel").animate({"width": "50px"},500);
  $("#rh-panel").addClass("closed");

  var tooltip = d3.select("#map").append("div").attr("class", "tooltip hidden");

  var country, state;

  var projection = d3.geo.albersUsa()
      .scale(900)
      .translate([width / 2, height / 2]);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select("#map").append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", m_width)
    .attr("height", m_width * height / width);

  svg.append("rect")
    .attr("class", "background")
    .attr("id", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click",function(){
      $("#rh-panel").empty();
      $("#rh-panel").append("<div id='rh-panel-header'>" + "<h4 style='padding-left:25%'><span class='glyphicon glyphicon-th-list'></span></h4><br>" + "</div>");
      $("#rh-panel").animate({"width": "50px"},500);
      $("#rh-panel").addClass("closed");
    });

  var g = svg.append("g");

  d3.json("json/us-states.json", function(error, us) {
    g.append("g")
      .attr("id", "countries")
      .selectAll("path")
      .data(us.features)
      .enter()
      .append("path")
      .attr("id", function(d) { return d.id; })
      .attr("class", "state")
      .attr("d", path)
      .style("stroke","black")
      .style("fill", function(d, i) {
          var abbrev = stateHashMap[d.properties.name];
          if(usaData[abbrev]) {
            var numCoauthors = (usaData[abbrev]).coauthors;
            return getFill(numCoauthors, noCoauthors,colors);
          } else {
            return getFill(0, noCoauthors,colors);
          }
        })
      .on("mousemove", function(d,i) {
        var abbrev = stateHashMap[d.properties.name];
        d3.select(this).style("fill", "#66C2FF"); 
        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
        tooltip
          .classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+300)+"px;top:"+(mouse[1]+200)+"px")
          .html(d.properties.name + "<br>" + "Co-authorships: " + (usaData[abbrev]).coauthors)
      })
      .on("mouseout",  function(d,i) {
        var abbrev = stateHashMap[d.properties.name];
        d3.select(this).style("fill", function(d, i) {
          var abbrev = stateHashMap[d.properties.name];
          if(usaData[abbrev]) {
            var numCoauthors = (usaData[abbrev]).coauthors;
            return getFill(numCoauthors, noCoauthors,colors);
          } else {
            return getFill(0, noCoauthors,colors);
          }
        })
        tooltip.classed("hidden", true);
      })
      .on("click", state_clicked);
  });
  
  function zoom(xyz) {
    /*g.transition()
      .duration(750)
      .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
      .selectAll(["#countries", "#states", "#cities"])
      .style("stroke-width", 1.0 / xyz[2] + "px")
      .selectAll(".city")
      .attr("d", path.pointRadius(20.0 / xyz[2]));*/
  }

  function get_xyz(d) {
    var bounds = path.bounds(d);
    var w_scale = (bounds[1][0] - bounds[0][0]) / width;
    var h_scale = (bounds[1][1] - bounds[0][1]) / height;
    var z = .96 / Math.max(w_scale, h_scale);
    var x = (bounds[1][0] + bounds[0][0]) / 2;
    var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
    return [x, y, z];
  }

  function state_clicked(d) {
    if(!d) {
      if(!($("#rh-panel").hasClass("closed"))){
        $("#rh-panel").empty();
        $("#rh-panel").append("<div id='rh-panel-header'>" + "<h3 style='padding-left:25%'><span class='glyphicon glyphicon-th-list'></span></h3><br>" + "</div>");
        $("#rh-panel").animate({"width": "50px"},500);
        $("#rh-panel").addClass("closed");
      } 
    }

    if (d && country !== d) {
      var xyz = get_xyz(d);
      country = d;
    } else {
      var xyz = [width / 2, height / 1.5, 1];
      country = null;
      zoom(xyz);
    }
    if(!(d3.select(this)).classed("background")) {
      d3.selectAll(".clicked").classed("clicked", false);
      d3.select(this).classed("clicked", true);
      current = d.properties.name;
      getAuthorData(currentData, current);
      $("#rh-panel").show();
      $("#rh-panel").removeClass("closed");
    }
  }

  $(window).resize(function() {
    var w = $("#map").width();
    svg.attr("width", w);
    svg.attr("height", w * height / width);
  });

}

/* Total Count, top 3 other orgs, top 3 cornell authors, last co-authorship year */
function getAuthorData(results,ctry) {
  $("#rh-panel").empty();
  $("#rh-panel").css({"width":"250px"})
  $("#rh-panel").append("<div id='rh-panel-header'>" + "<h4><span class='glyphicon glyphicon-th-list'></span><span style='color:orange' id='country-selected'>" + ctry + "</span><br><hr></h4></div>");
  var authors,
  count = 0,
  latestPublicationYear = 0,
  authorCount = {},
  institutionCount = {},
  current = ctry,
  ctrys = Object.keys(sample_data);

  
    for(var i = 0 ; i < results.length ; i++) {
      authors = (results[i]).authors;
      var affiliated = false;

        for(var j = 0 ; j < authors.length ; j++) {

          if(contains(ctrys, ctry)) {
            if(authors[j].country && (authors[j].country).toLowerCase() == ctry.toLowerCase()) {
              affiliated = true;
              count++;
              if(contains((authors[j]).authorName, Object.keys(authorCount))) {
                authorCount[(authors[j]).authorName] += 1; 
              } else {
                authorCount[(authors[j]).authorName] = 1; 
              }
              var institution = ((authors[j]).authorAffiliation).localName;
              if(institutionCount[institution]) {
                institutionCount[institution] = institutionCount[institution] + 1; 
              } else {
                institutionCount[institution] = 1; 
              }
            }
          } else if (authors[j].state) {
            var abbrev = stateHashMap[ctry];

            if(authors[j].state == abbrev) {
              affiliated = true;
              count++;
              if(contains((authors[j]).authorName, Object.keys(authorCount))) {
                authorCount[(authors[j]).authorName] += 1; 
              } else {
                authorCount[(authors[j]).authorName] = 1; 
              }
              var institution = ((authors[j]).authorAffiliation).localName;
              if(institutionCount[institution]) {
                institutionCount[institution] = institutionCount[institution] + 1; 
              } else {
                institutionCount[institution] = 1; 
              }
            }
          }
        }
            
      if(affiliated) {
        if(parseInt((results[i]).yearOfPublication) > latestPublicationYear) {
          latestPublicationYear = parseInt((results[i]).yearOfPublication);
        }
      }

    }

  if(count > 0) {
    if(contains(ctrys, ctry)){
      $("#rh-panel").append("<div id='article-info'>"
        + "<h8>COAUTHORSHIPS<br><br></h8><ul><li>Total: <span id='count'>" + getCoauthors(ctry) + "</span></li></ul>"
        + "</div>"
        + "<div id='article-info'>"
        + "<h8>Featured External Organizations<br><br></h8><ul><li>" + (Object.keys(institutionCount))[0] + "</li><li>" + (Object.keys(institutionCount))[1] + "</li><li>" + (Object.keys(institutionCount))[2] + "</li></ul>"
        + "</div>"
        + "<div id='article-info'>"
        + "<h8>Featured Cornell Authors<br><br></h8><ul><li>" + (Object.keys(authorCount))[0] + "</li><li>" + (Object.keys(authorCount))[1] + "<li>" + (Object.keys(authorCount))[2] + "</li></ul>"
        + "</div>"
        + "<div id='article-info'>"
        + "<h8>Last Co-authorship Year: <span id='count'>" + latestPublicationYear + "</span></h8>"
        + "</div>");
    } else {
      $("#rh-panel").append("<div id='article-info'>"
        + "<h8>COAUTHORSHIPS<br><br></h8><ul><li>Total: <span id='count'>" + (usaData[abbrev]).coauthors + "</span></li></ul>"
        + "</div>"
        + "<div id='article-info'>"
        + "<h8>Featured External Organizations<br><br></h8><ul><li>" + (Object.keys(institutionCount))[0] + "</li><li>" + (Object.keys(institutionCount))[1] + "</li><li>" + (Object.keys(institutionCount))[2] + "</li></ul>"
        + "</div>"
        + "<div id='article-info'>"
        + "<h8>Featured Cornell Authors<br><br></h8><ul><li>" + (Object.keys(authorCount))[0] + "</li><li>" + (Object.keys(authorCount))[1] + "<li>" + (Object.keys(authorCount))[2] + "</li></ul>"
        + "</div>"
        + "<div id='article-info'>"
        + "<h8>Last Co-authorship Year: <span id='count'>" + latestPublicationYear + "</span></h8>"
        + "</div>");
    }
  }

  if(count == 0) {
    if(contains(ctrys, ctry)) {
      $("#rh-panel").append("<div id='rh-panel-header'>"
          + "There are no affiliations with the selected country.</div>");
    } else {
      $("#rh-panel").append("<div id='rh-panel-header'>"
          + "There are no affiliations with the selected state.</div>");
    }
  }

}

/* Helper functions. */

function getCoauthors(name) {
  if(sample_data[name]) { 
    return (sample_data[name].coauthors);
  } else {
    return 0; 
  }
}

function getFill(num, arr, colors) {
  var range = (arr[arr.length-1] / colors.length);
  if(num == 0) {return "#ddd"; }
  if(num >= 0 && num <= range) { return colors[0]; }
  if(num >= 350) { return colors[7] }
  for (var i = 1 ; i < (parseInt(range) + 1) ; i++) {
    if (num >= (range * i) && num <= (range * (i + 1))) { return colors[i]; }
  }
}

/* i.e. "Sejong Univ, Dept Chem, Seoul 143747, South Korea;", */
function getInstitution(str) {
  var arr = str.split(',', 1);
  arr = (arr[0]).split(' ');
  return arr[0] + " " + arr[1];
}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
