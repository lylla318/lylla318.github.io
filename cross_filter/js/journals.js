
$(document).ready(function() {

    var originalJournalData = [], currentJournalData = [],
        originalBubbleData = [], currentBubbleData = [],
        originalListData = [], currentListData = [],
        sortedData = [], currentBarData = []; 
    
    var  barChart, bar, xBar, yBar, xBarAxis, yBarAxis, widthBar, heightBar;

    d3.queue()
        .defer(d3.csv,  "JournalVizOutput.csv")
        .defer(d3.csv,  "data/journal-list.csv")
        .defer(d3.json, "flare.json")
        .defer(d3.csv,  "data/date-count-data.csv")
        .awaitAll(ready);

    function ready (error, results) {
        originalJournalData = results[0];
        originalListData    = results[1];
        originalBubbleData  = results[2];
        originalBarData     = results[3];

        sortedData = sortJournalData(originalJournalData);

        var dataByJournal = sortedData[0],
            dataByYear    = sortedData[1],
            dataByUnit    = sortedData[2],
            dataByTopic   = sortedData[3];
        
        drawJournalList(originalListData);
        drawBarChart(originalBarData);
        drawBubbleChart(originalBubbleData);
    }



function redrawFromCircle(info) {

    /* Remove current vis. */
    //$("#barChart").empty();
    $("#journal-list").empty();

    /* Filter by Unit. */
    if(info[0] === "unit") {
        var unit = info[1];
    }

    var filtered = filterFromBubble(info);

    currentBarData  = filtered.barData;
    currentListData = filtered.listData;

    drawJournalList(currentListData);
    //drawBarChart(currentBarData);
    redrawBarChart(currentBarData);


}

function redrawBarChart(data) {

    var transition0 = barChart.transition().duration(500),
        parseDate   = d3.isoParse;

    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });

    xBar.domain(data.map(function(d) { return d.date; }));
    yBar.domain([0, d3.max(data, function(d) { return d.value; })]);

    var transition1 = transition0.transition();
    transition1.selectAll(".y-bar-axis").call(yBarAxis);

    d3.selectAll("#bar").remove();

    var t = d3.transition()
        .duration(500)
        .ease(d3.easeLinear)

    bar = barChart.selectAll("bar").data(data)
        
    bar.exit().remove()
  
    bar.enter().append("rect").classed("bar", true)
        .merge(bar) 
        .attr("id","bar")
        .attr("fill", "steelblue")
        .attr("width", xBar.bandwidth())
        .attr("height", 0)
        .attr("transform", function(d){ return "translate("+[xBar(d.date), heightBar]+")"})
        .on("mouseover", function(d) {
            tooltip.text(/*d.className + ": " + */format(d.value)+" Journals");
            tooltip.style("visibility", "visible");
        })
        .on("mousemove", function() {
            return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
        })
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
        .style("cursor","pointer");

          
    barChart.selectAll(".bar").transition(t)
        .attr("height", function(d){ return heightBar - yBar(d.value); })
        .attr("transform", function(d){ return "translate("+[xBar(d.date), yBar(d.value)]+")"})

    barChart.append("g")
    .attr("class", "brush")
    .call(d3.brushX()
        .extent([[0, 0], [widthBar, heightBar]])
        .on("end", brushended));

    function brushended() {
        if (!d3.event.sourceEvent) return; 
        if (!d3.event.selection) return; 
    }

    // bar = barChart.selectAll("bar").data(data)
        
    // bar.exit().remove()
  
    // bar.enter().append("rect").classed("bar", true)
    //     .merge(bar) 
    //     .attr("fill", "steelblue")
    //     .attr("width", xBar.bandwidth())
    //     .attr("height", 0)
    //     .attr("transform", function(d){ return "translate("+[xBar(d.date), heightBar]+")"})
    //     .on("mouseover", function(d) {
    //         tooltip.text(/*d.className + ": " + */format(d.value)+" Journals");
    //         tooltip.style("visibility", "visible");
    //     })
    //     .on("mousemove", function() {
    //         return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
    //     })
    //     .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
    //     .style("cursor","pointer");

          
    // barChart.selectAll(".bar").transition(transition0)
    //     .attr("height", function(d){ return heightBar - yBar(d.value); })
    //     .attr("transform", function(d){ return "translate("+[xBar(d.date), yBar(d.value)]+")"})

}

function transformBar(d) {
    return "translate(" + x(d.date) + "," + y(d[city]) + ")";
}


function drawBarChart(data) {

    var margin = {top: 20, right: 20, bottom: 70, left: 40},
    format = d3.format(",d");

    heightBar = 150 - margin.top - margin.bottom;
    widthBar  = 700 - margin.left - margin.right;

    /* Parse the date / time */
    var parseDate = d3.isoParse

    xBar = d3.scaleBand().rangeRound([0, widthBar], .05).padding(0.1);

    yBar = d3.scaleLinear().range([heightBar, 0]);

    /* Create the axes. */
    xBarAxis = d3.axisBottom()
        .scale(xBar)
        .ticks(d3.timeYear.every(4))
        .tickFormat(d3.timeFormat("%Y"));

    yBarAxis = d3.axisLeft()
        .scale(yBar)
        .ticks(3);

    barChart = d3.select("#barChart").append("svg")
        .attr("width", widthBar + margin.left + margin.right)
        .attr("height", heightBar + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select("body")
        .append("div")
        .attr("class","tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("color", "white")
        .style("padding", "8px")
        .style("background-color", "rgba(0, 0, 0, 0.75)")
        .style("border-radius", "6px")
        .style("font", "12px sans-serif")
        .text("tooltip");
      
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });

    /* Set the domains. */
    xBar.domain(data.map(function(d) { return d.date; }));

    yBar.domain([0, d3.max(data, function(d) { return d.value; })]);

    barChart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightBar + ")")
        .call(xBarAxis)
    .selectAll("text")
        .attr("id","bar-text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

    barChart.append("g")
        .attr("class", "y-bar-axis")
        .call(yBarAxis)
    .append("text")
        .attr("id","bar-text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("fill","black")
        .text("Count");


    /* Implement the transition. */
    var t = d3.transition()
        .duration(500)
        .ease(d3.easeLinear)

    bar = barChart.selectAll("bar").data(data)
        
    bar.exit().remove()
  
    bar.enter().append("rect").classed("bar", true)
        .merge(bar) 
        .attr("id","bar")
        .attr("fill", "steelblue")
        .attr("width", xBar.bandwidth())
        .attr("height", 0)
        .attr("transform", function(d){ return "translate("+[xBar(d.date), heightBar]+")"})
        .on("mouseover", function(d) {
            tooltip.text(/*d.className + ": " + */format(d.value)+" Journals");
            tooltip.style("visibility", "visible");
        })
        .on("mousemove", function() {
            return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
        })
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
        .style("cursor","pointer");

          
    barChart.selectAll(".bar").transition(t)
        .attr("height", function(d){ return heightBar - yBar(d.value); })
        .attr("transform", function(d){ return "translate("+[xBar(d.date), yBar(d.value)]+")"})

    barChart.append("g")
    .attr("class", "brush")
    .call(d3.brushX()
        .extent([[0, 0], [widthBar, heightBar]])
        .on("end", brushended));

    function brushended() {
        if (!d3.event.sourceEvent) return; 
        if (!d3.event.selection) return; 
    }

}


function drawJournalList(jrnls) {

    var data = [];
    for (var i = 60 ; i > 0 ; i--) {
        data.push(jrnls[i]);
    }

    var margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = 400 - margin.left - margin.right,
    height = 1200 - margin.top - margin.bottom;

    var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);

    var x = d3.scaleLinear()
        .range([0, width]);
          
    var svg = d3.select("#journal-list").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select("body")
        .append("div")
        .attr("class","tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("color", "white")
        .style("padding", "8px")
        .style("background-color", "rgba(0, 0, 0, 0.75)")
        .style("border-radius", "6px")
        .style("font", "12px sans-serif")
        .text("tooltip");

    console.log('DATA: ',data)

    data.forEach(function(d) {
        console.log(d);
        d.count = +d.count;
    });

    x.domain([0, d3.max(data, function(d){ return d.count; })])
    y.domain(data.map(function(d) { return d.journal; }));

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")

    bars.append("rect")
        .attr("class", "bar")
        .attr("width", function(d) {return x(d.count); } )
        .attr("x", 0)
        .attr("y", function(d) { return y(d.journal); })
        .attr("height", y.bandwidth())
        .style("cursor","pointer")
        .style("fill","#A9A9A9")
        .on("mouseover", function(d) {
            tooltip.text(d.count + " Articles");
            tooltip.style("visibility", "visible");
        })
        .on("mousemove", function() {
            return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
        })
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
    
    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    //add a value label to the right of each bar
    bars.append("text")
        .attr("id","list-text")
        .attr("class", "label")
        .attr("y", function (d) {
            return y.bandwidth()/2 + y(d.journal) ;
        })
        .attr("x", function (d) { return  3; })
        .attr("dy", ".3em") 
        .attr("text-anchor", "start")
        .text(function (d) { return d.journal; });


}


function drawBubbleChart(data) {

    var diameter = 350,
    format = d3.format(",d"),
    color = d3.scaleOrdinal(d3.schemeCategory20c);

    var bubble = d3.pack()
        .size([diameter, diameter])
        .padding(1.5);

    var bubbleChart = d3.select("#bubbleChart").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    var tooltip = d3.select("body")
        .append("div")
        .attr("class","tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("color", "white")
        .style("padding", "8px")
        .style("background-color", "rgba(0, 0, 0, 0.75)")
        .style("border-radius", "6px")
        .style("font", "12px sans-serif")
        .text("tooltip");

    d3.json("flare.json", function(error, data) {
        if (error) throw error;

        var root = d3.hierarchy(classes(data))
            .sum(function(d) { return d.value; })
            .sort(function(a, b) { return b.value - a.value; });

    bubble(root);
    var node = bubbleChart.selectAll(".node")
        .data(root.children)
        .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.data.className + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("cursor","pointer")
        .style("fill", function(d) { 
            return color(d.data.packageName); 
        })
        .on("mouseover", function(d) {
            tooltip.text(format(d.value)+" Journals");
            tooltip.style("visibility", "visible");
        })
        .on("mousemove", function() {
            return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
        })
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
        .on("click", function(d) {
            d3.selectAll("circle").style("fill","#ddd");
            d3.select(this).style("fill","steelblue");
            //console.log(d);
            redrawFromCircle(["unit",d.data.className]);
        });

    node.append("text")
        .attr("dy", ".3em")
        .attr("id", "bubble-text")
        .style("text-anchor", "middle")
        .text(function(d) { 
            if(d.value > 3000) {
                return d.data.className.substring(0, d.r / 5); 
            } else {
                return "";
            }
        });  
    });

    /* Returns a flattened hierarchy containing all leaf nodes under the root. */
    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
            else classes.push({packageName: name, className: node.name, value: node.size});
        }

        recurse(null, root);
        return {children: classes};
    }

    d3.select(self.frameElement).style("height", diameter + "px");

}


/* Helper Function -- Some for parsing data / generating csv's -- no longer needed*/

function filterFromBubble(info) {

    var filtered = [], dateData = [], barData = [], listDict = {}, listData = [];

    if(info[0] === "unit") {
        //console.log(info[1]);
        
        if(info[1] === "Cornell Johnson College of Business") {
            info[1] = "Cornell SC Johnson College of Business";
        }

        /* Filter original data. */
        for (let obj of originalJournalData) {
            if((obj.unit).toLowerCase() === info[1].toLowerCase()) { 
                filtered.push(obj); 

                if(dateData[obj.year]) { dateData[obj.year]++; } else { dateData[obj.year] = 1; }

                if(listDict[obj.journal]) { listDict[obj.journal]++; } else { listDict[obj.journal] = 1; }

            }
        }

        /* Process bar graph data. */        
        for (var i = 1965 ; i < 2018 ; i++) {
            tmp = {"date":String(i)+"-03-02T00:00:00-05:00" , "value": dateData[String(i)]}
            barData.push(tmp);
        }

        /* Process list graph data. */
        sortListData = sortByValue(listDict);
        for (let entry of sortListData) {
            tmp = {"journal":entry , "count": listDict[entry]}
            listData.push(tmp);
        }

        return {"barData":barData, "listData":listData};

    }

}

function filterListData(info) {

    if(info[0] === "unit") {
        //console.log("TBD")
    }
}

function processJournalList(data) {

    var nested = [["journal","count"]], toSort = {};

    for (let key of Object.keys(data)) {
        toSort[key] = (data[key]).length;
    }

    var sorted = sortByValue(toSort);

    for (let obj of sorted) {
        var orig = obj, parsed = obj.replace(/,/g, "")
        nested.push([parsed,(data[orig]).length])
    }

    var csvContent = "data:text/csv;charset=utf-8,";
    nested.forEach(function(infoArray, index){
       dataString = infoArray.join(",");
       csvContent += index < nested.length ? dataString+ "\n" : dataString;
    }); 

    var encodedUri = encodeURI(csvContent);
    //window.open(encodedUri);

}

/* Sort a dictionary by value. */
function sortByValue(data) {
    var result = Object.keys(data).sort(function(a, b) {
      return data[b] - data[a];
    })
    return result;
}

/* Sort a dictionary by key. */
function sortByKey(data) {
    var result = Object.values(data).sort(function(a, b) {
      return data[b] - data[a];
    })
    return result;
}


/* Sort journal data into data structures by field. */
function sortJournalData(data) {
    var dataByJournal = {}, dataByYear = {}, dataByUnit = {}, dataByTopic = {};

    for (let obj of data) {
        if(dataByJournal[obj.journal]) {dataByJournal[obj.journal].push(obj);} else {dataByJournal[obj.journal] = [obj];}
        if(dataByYear[obj.year]) {dataByYear[obj.year].push(obj);} else {dataByYear[obj.year] = [obj];}
        if(dataByUnit[obj.unit]) {dataByUnit[obj.unit].push(obj);} else {dataByUnit[obj.unit] = [obj];}

        for (let topic of obj.topics) {
            if(dataByTopic[topic]) {dataByTopic[topic].push(obj);} else {dataByTopic[topic] = [obj];}
        }
    }

    processJournalList(dataByJournal);

    return [dataByJournal,dataByYear,dataByUnit,dataByTopic];
}


/* Used to generate csv for bar chart [by year]. */
function getDateDict(data) {
    var dict = {};
    for (let obj of data) {
        if(dict[(obj.year)+"-03-02T00:00:00-05:00"]) {
            dict[(obj.year)+"-03-02T00:00:00-05:00"]++;
        } else {
            dict[(obj.year)+"-03-02T00:00:00-05:00"] = 1;
        }
    }
    var jsonArray = [], nested = [["date","value"]];

    for (let key of Object.keys(dict)) {
        tmp = [key,dict[key]]
        var obj = {"year":key,"count":dict[key]}
        jsonArray.push(obj);
        nested.push(tmp);
    }


    var csvContent = "data:text/csv;charset=utf-8,";
    nested.forEach(function(infoArray, index){
       dataString = infoArray.join(",");
       csvContent += index < nested.length ? dataString+ "\n" : dataString;
    }); 

    var encodedUri = encodeURI(csvContent);
    //window.open(encodedUri);

    return jsonArray;
}


/* Used to sort journals by count. */
function processData(jrnls) {
    var journals = {}, names = {}, tmp = [], less = [];
    for (let jrnl of jrnls) {
        if(journals[jrnl.journal]) {
            journals[jrnl.journal] += parseInt(jrnl.count);
            names[jrnl.journal].push(jrnl);
        } else {
            journals[jrnl.journal] = parseInt(jrnl.count);
            names[jrnl.journal] = [jrnl];
        }
    }

    for (let journal of Object.keys(journals)) {
        if(journals[journal] > 100) {
            for (let obj of names[journal]) {
                tmp.push(obj);
            }
        } else {
            for (let obj of names[journal]) {
                less.push(obj);
            }

        }
    }

    return {"greater100":tmp,"lesser100":less};
}


});

/* 

Block resources:

https://bl.ocks.org/mbostock/3903818 - axis transition
https://bl.ocks.org/mbostock/1166403 - axis transition



*/



// p();

// function p() {
//     var csvContent = "data:text/csv;charset=utf-8,";
//     nested.forEach(function(infoArray, index){
//        dataString = infoArray.join(",");
//        csvContent += index < nested.length ? dataString+ "\n" : dataString;
//     }); 

//     var encodedUri = encodeURI(csvContent);
//     window.open(encodedUri);
// }





