/* Global Variables */



/* Academic Unit = cornellAffiliation ; */

function setData() {
	var results = currentData;
	for(var i = 0 ; i < results.length ; i++) {
		for (var j = 0 ; j < (results[i].authors).length ; j++) {
			var author = (results[i].authors)[j];
			if(author.cornellAffiliation && !contains(currentAffiliations, author.cornellAffiliation)) {
				currentAffiliations.push(author.cornellAffiliation);
			}
		}
	}

	//addList("#academic-unit", affiliations, "Academic Unit"); 
	addList("#academic-unit", currentAffiliations, "Academic-Unit"); 

}

/* Adds a checkbox for each member of the list. */
function addList(id, array, field){ 
	var anchorDiv = d3.select(id); 
	var labels = anchorDiv.selectAll("div")
	.data(array.sort())
	.enter()
	.append("li"); 
	labels
	.append("input")
	.attr("checked", true)
	.attr("type", "checkbox")
	.attr("class", "cbox" +field)
	.attr("id", function(d,i) { return i; })
	.attr("for", function(d,i) { return i; })
	.on("change", function(d){
		
		var className = $(this).attr("class");
		
		if (className === "cboxAcademic-Unit"){ 
			var bool = d3.select(this).property("checked");
			if(bool == false){ // no longer checked
				console.log("uncheck");
				removedAffiliations.push(d);
				for(var i =  0; i < currentAffiliations.length ; i++) {
					if(currentAffiliations[i] === d) {
						currentAffiliations = currentAffiliations.filter(function(el) {
						    return el !== currentAffiliations[i];
						});
					}
				}
				updateData(d,"academic-unit",false);
				updateMapData();
			} else { // checked
				console.log("check");
				currentAffiliations.push(d);
				for(var i =  0; i < removedAffiliations.length ; i++) {
					if(removedAffiliations[i] === d) {
						removedAffiliations = removedAffiliations.filter(function(el) {
						    return el !== removedAffiliations[i];
						});
					}
				}
				updateData(d,"academic-unit",true)
				updateMapData();
			}
		}

		//updateChecks(); //update the checks
	});

	labels.append("label").attr("class", "label" +field).text(d=>d);
}

function updateData(item,itemType,addItem) {
	console.log("current length 1: ", currentData.length);
	if(!addItem) { // removing 
		if(itemType === "academic-unit") {
			for(var i = 0 ; i < currentData.length ; i++) {
				var authors = (currentData[i]).authors;
				var filter = false;
				for(var j = 0 ; j < authors.length ; j++) {
					if((authors[j]).cornellAffiliation === item) filter = true;
				}
				if(filter) {
					filteredData.push(currentData[i]); // add to filtered data
					currentData = currentData.filter(function(el) { // remove from current data
					    return el !== currentData[i];
					});
				}
			}
		}
	} else { // adding back
		if(itemType === "academic-unit") {
			var f = 0;
			for(var i = 0 ; i < filteredData.length ; i++) {
				var authors = (filteredData[i]).authors;
				var addBack = false;
				for(var j = 0 ; j < authors.length ; j++) {
					if((authors[j]).cornellAffiliation === item) addBack = true;
				}
				if(addBack) {
					f++;
					currentData.push(filteredData[i]); // add back to current data
					filteredData = filteredData.filter(function(el) { // remove from filtered data
					    return el !== filteredData[i];
					});
				}
			}
			console.log("f: ", f);
		}
	}

	console.log("filtered length: ",filteredData.length);
	console.log("current length 2: ",currentData.length);
}

function updateViz() {
	/* TODO */
}

function updateChecks() {
	var currentNames = getNameList(currentData);
	d3.selectAll('input').property("checked", function(d){
		if(currentNames.indexOf(d) != -1 ){
			return true;
		}
		else{
			return false;
		}
	});
}


function getNameList(array){
	var nameList = [];
	array.forEach(function(d){
		var people = d.people; 

		var grantPeople = people.map(function(person){
			nameList.push(person.name);
			return person.name; 
		});
	});
	nameList = _.uniq(nameList);
	return nameList;
}

/* Helper Functions. */

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

function remove(array, obj) {
	for(var i = array.length-1; i--;){
		if (array[i] === obj) array.splice(i, 1);
	}
}