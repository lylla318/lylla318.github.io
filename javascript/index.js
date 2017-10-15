
$(document).ready(function(){
  $(".WORK").click(function (){
    $('html, body').animate({ scrollTop: $(".visualizations-section").offset().top-130 }, 1000);
  });
  $(".ABOUT").click(function (){
    $('html, body').animate({ scrollTop: $(".about-section").offset().top-130 }, 1000);
  });
  $(".CONTACT").click(function (){
    $('html, body').animate({ scrollTop: $(".contact-section").offset().top-130 }, 1000);
  });
  $(".HOME").click(function (){
    $('html, body').animate({ scrollTop: $(".visualizations-section").offset().top-130 }, 1000);
  });
});

var margin = {top: 2, right: 2, bottom: 2, left: 2},
    width = 500 - margin.left - margin.right,
    height = 65 - margin.top - margin.bottom, r = 3;

var svg = d3.select(".menu").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var circs = [
  [5, 9],
  [55,9],
  [105, 9],
  [155, 9],
  [205, 9],
  [255, 9]
];

var points = [
  [[55-r,9],[5+r, 9]],
  [[105-r, 9],[55+r,9]],
  [[155-r, 9],[105+r, 9]],
  [[205-r, 9],[155+r, 9]],
  [[255-r, 9],[205+r, 9]]
];

var valueline = d3.line()
    .curve(d3.curveCardinalClosed.tension(0))
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; });

for (var i = 0 ; i < points.length ; i++) {
    svg.append("path")
        .attr("id","path")
        .data([points[i]])
        .attr("class", "line")
        .attr("d", valueline);
}
    

svg.selectAll(".point")
    .data(circs)
  .enter()
    .append("circle")
        .attr("r", r)
        .attr("class",function(d){
            return "circ"+pointToClass(d);
        })
        .attr("fill",function(d){
            if(d[0] == 5 || d[0] == 355) {
                return "black";
            } else {
                return "none";
            }
        })
        .attr("stroke","black")
        .attr("stroke-width",1)
        .style("cursor","pointer")
        .attr("transform", function(d) { return "translate(" + d + ")"; });r

var menuItems = ["HOME","WORK","ABOUT","CONTACT"]

for (var i=1 ; i<circs.length-1 ;i++) {
    var x = circs[i][0] - 2;
    svg.append("text")
        .attr("id","menuText")
        .attr("class",menuItems[i-1])
        .style("text-anchor", "start")
        .style("cursor","pointer")
        .style("font-family","vcr")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d,i){
          return "translate(" + x + "," + 30 + ") rotate(90)";
        })
        .text(menuItems[i-1])
        .on("mouseover",function(d){
          d3.select(this).style("fill","#02818a").style("font-size","10px"); 
        })
        .on("mouseout",function(){
          if(!d3.select(this).classed("clicked")) {d3.select(this).style("fill","black").style("font-size","10px") }
        })
        .on("click",function(){
          d3.selectAll(".clicked").style("fill","black").style("font-size","10px").classed("clicked",false);
          d3.select(this).style("fill","#02818a").style("font-size","10px").attr("class","clicked")
        })

}

function pointToClass(d){
    if(d[0] == 5){
        return "About";
    } else if (d[0] == 55) {
        return "Portfolio";
    } else if (d[0] == 105) {
        return "Poetry";
    } else if (d[0] == 155) {
        return "Blog";
    } else if (d[0] == 205) {
        return "Contact";
    } else {
        return "None";
    }
}


