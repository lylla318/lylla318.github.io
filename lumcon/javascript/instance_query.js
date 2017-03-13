/* Get the instance data from the json file. */
queue()
	.defer(d3.json, "data/tv_instance_data.json")
	.awaitAll(function(error, results){ 
		renderInterface(results);
	}); 

/* Global Variables */
var filterItems = [];
var fields = ["Name", "Country", "Instance_Date" , "Threat_Source", "Threat_Source_Category", "Content_Type", "Focus_Topics", "Instance_Summary"];

function renderInterface (results) {
	$(".query-button").click(function() {
		$(".results").remove();
		$(".result-info-text").remove();
		var data = results[0],
			name = $("#name").val(),
			nationality = $("#nationality").val(),
			genderM = $('#gender-m').is(":checked"),
			genderF = $('#gender-f').is(":checked"),
			genderO = $('#gender-o').is(":checked"),
			threatYear = $("#threat-year").val(),
			focusAreas = $("#focus-area").val(),
			commOutlets = $("#comm-outlets").val(),
			isFiltered = false,
			filteredData = data;

		if(name){
		   	for(var j=0 ; j < data.length ; j++) {
		    	if(data[j]["Name"].includes(name)) {
		    		filteredData.push(data[j]);
		    	}
		    }
		}

		if(nationality && nationality.length > 0){
			isFiltered = true;
			var temp = [];
			for(var j=0 ; j < filteredData.length ; j++) {
				for(var k=0 ; k < nationality.length ; k++) {
					if(filteredData[j]["Country"].includes(nationality[k])) {
		    			temp.push(filteredData[j]);
		    		}
				}
		    }
		    filteredData = temp;
		}

		if(genderM && !genderF && !genderO) {
			isFiltered = true;
			var temp = [];
			for(var j=0 ; j < filteredData.length ; j++) {
				if(filteredData[j]["Gender"].includes("Male")) {
		    		temp.push(filteredData[j]);
		    	}
		    }
		    filteredData = temp;

		} else if (!genderM && genderF && !genderO) {
			isFiltered = true;
			var temp = [];
			for(var j=0 ; j < filteredData.length ; j++) {
				if(filteredData[j]["Gender"].includes("Female")) { 
		    		temp.push(filteredData[j]);
		    	}
		    }
		    filteredData = temp;
		} else if (!genderM && !genderF && genderO) {
			isFiltered = true;
			var temp = [];
			for(var j=0 ; j < filteredData.length ; j++) {
				if(filteredData[j]["Gender"].includes("Other")) {
		    		temp.push(filteredData[j]);
		    	}
		    }
		    filteredData = temp;
		}

		if(threatYear.length > 0){
			isFiltered = true;
			var temp = [];
			for(var j=0 ; j < filteredData.length ; j++) {
				for(var k=0 ; k < threatYear.length ; k++) {
					var date = filteredData[j]["Update_Date"];
					var ind = date.indexOf("/");
					if(ind != -1) {
						date = date.substring(ind+1)
					}
					ind = date.indexOf("/");
					if(ind != -1) {
						date = date.substring(ind+1);
					}
					if(date.length == 2){
						date = ("20"+date);
					}
					date.trim();
					if(date == threatYear[k]) {
		    			temp.push(filteredData[j]);
		    		}
				}
		    }
		    filteredData = temp;
		}

		if(focusAreas){
			isFiltered = true;
			var temp = [];
			for(var j=0 ; j < filteredData.length ; j++) {
				for(var k=0 ; k < focusAreas.length ; k++) {
					if(filteredData[j]["Focus_Topics"].includes(focusAreas[k])) {
		    			temp.push(filteredData[j]);
		    		}
				}
		    }
		    filteredData = temp;
		}

		if(commOutlets){
			isFiltered = true;
			var temp = [];
			for(var j=0 ; j < filteredData.length ; j++) {
				for(var k=0 ; k < commOutlets.length ; k++) {
					if(filteredData[j]["Communication_Outlets"].includes(commOutlets[k])) {
		    			temp.push(filteredData[j]);
		    		}
				}
		    }
		    filteredData = temp;
		}

		if(!isFiltered) {
			var resultsString = "<p class='result-info-text'>No results match your query.</p>";
			$(resultsString).appendTo(".result-info");
		} else {
			var resultsString = "<p class='result-info-text'>Your query found " + filteredData.length + " results.</p>";
			$(resultsString).appendTo(".result-info");
		}

		for(var j=0 ; j < filteredData.length ; j++) {
			var availableFields = [];
			for(var k=0 ; k < fields.length ; k++) {
			    if(filteredData[j][fields[k]] != "" && filteredData[j][fields[k]] != "-") { availableFields.push(fields[k]); }
			}
			var resultsString = "<p class='results-para'>";
			for(var k=0 ; k < availableFields.length ; k++) {
				if(filteredData[j][availableFields[k]]) {
				resultsString += ("<span class='availableFields'>" + (availableFields[k]).replace("_", " ") + "</span>" 
			    	+ ": " + filteredData[j][availableFields[k]] + "<br>")
				}
			}
			if((filteredData[j]).Main_Source) {
				resultsString += "<a href='" + (filteredData[j]).Main_Source + "' class='block-link__overlay-link' target='_blank'></a>"
			}
			resultsString += "</p>";
			resultsDiv = "<div class='results col-md-3'>" + resultsString + "</div>";
			$(resultsDiv).appendTo(".results-section");
		}

	});
}
