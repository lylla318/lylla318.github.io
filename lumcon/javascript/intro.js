/* Get the instance data from the json file. */
var initializedGraph = false;

queue()
	.defer(d3.csv, "data/instance-data.csv")
	.awaitAll(function(error, results){ 
        $(document).ready(function() {
            parseCountries();
            createBar();
        });
	}); 

var data = {"Afghanistan":1,"Albania":0,"Algeria":6,"American Samoa":0,"Andorra":0,"Angola":2,"Anguilla":0,"Antarctica":0,"Antigua and Barbuda":0,"Argentina":0,"Armenia":0,"Aruba":0,"Australia":0,"Austria":0,"Azerbaijan":26,"Bahamas":0,"Bahrain":40,"Bangladesh":26,"Barbados":0,"Belarus":1,"Belgium":0,"Belize":0,"Benin":0,"Bermuda":0,"Bhutan":0,"Bolivia":0,"Bosnia and Herzegowina":0,"Botswana":0,"Bouvet Island":0,"Brazil":1,"British Indian Ocean Territory":0,"Brunei Darussalam":0,"Bulgaria":0,"Burkina Faso":0,"Burundi":0,"Cambodia":1,"Cameroon":1,"Canada":0,"Cape Verde":0,"Cayman Islands":0,"Central African Republic":0,"Chad":2,"Chile":0,"China":54,"Christmas Island":0,"Cocos (Keeling) Islands":0,"Colombia":2,"Comoros":0,"Democratic Republic of the Congo":0,"Cook Islands":0,"Costa Rica":0,"Ivory Coast":3,"Croatia":2,"Cuba":9,"Cyprus":0,"Czech Republic":0,"Denmark":0,"Djibouti":0,"Dominica":0,"Dominican Republic":0,"East Timor":0,"Ecuador":8,"Egypt":78,"El Salvador":0,"Equatorial Guinea":0,"Eritrea":0,"Estonia":0,"Ethiopia":72,"Falkland Islands (Malvinas)":0,"Faroe Islands":0,"Fiji":0,"Finland":0,"France":0,"France Metropolitan":0,"French Guiana":0,"French Polynesia":0,"French Southern Territories":0,"Gabon":0,"Gambia":5,"Georgia":0,"Germany":2,"Ghana":1,"Gibraltar":0,"Greece":1,"Greenland":0,"Grenada":0,"Guadeloupe":0,"Guam":0,"Guatemala":0,"Guinea":0,"Guinea-Bissau":1,"Guyana":0,"Haiti":0,"Heard and Mc Donald Islands":0,"Vatican":0,"Honduras":0,"Hong Kong":0,"Hungary":2,"Iceland":0,"India":10,"Indonesia":1,"Iran":68,"Iraq":1,"Ireland":0,"Israel":1,"Italy":0,"Jamaica":0,"Japan":0,"Jordan":7,"Kazakhstan":5,"Kenya":2,"Kiribati":0,"North Korea":0,"South Korea":3,"Kuwait":14,"Kyrgyzstan":0,"Lao":0,"Latvia":0,"Lebanon":11,"Lesotho":0,"Liberia":0,"Libya":0,"Liechtenstein":0,"Lithuania":0,"Luxembourg":0,"Macau":0,"Macedonia":7,"Madagascar":0,"Malawi":0,"Malaysia":8,"Maldives":2,"Mali":0,"Malta":0,"Marshall Islands":0,"Martinique":0,"Mauritania":2,"Mauritius":0,"Mayotte":0,"Mexico":12,"Micronesia":0,"Moldova":1,"Monaco":1,"Mongolia":0,"Montserrat":0,"Morocco":40,"Mozambique":0,"Myanmar":4,"Namibia":0,"Nauru":0,"Nepal":4,"Netherlands":0,"Netherlands Antilles":0,"New Caledonia":0,"New Zealand":0,"Nicaragua":0,"Niger":0,"Nigeria":2,"Niue":0,"Norfolk Island":0,"Northern Mariana Islands":0,"Norway":0,"Oman":10,"Pakistan":2,"Palau":0,"Palestine":5,"Panama":0,"Papua New Guinea":0,"Paraguay":0,"Peru":1,"Philippines":3,"Pitcairn":0,"Poland":0,"Portugal":0,"Puerto Rico":0,"Qatar":3,"Reunion":0,"Romania":0,"Russia":30,"Rwanda":0,"Saint Kitts and Nevis":0,"Saint Lucia":0,"Saint Vincent and the Grenadines":0,"Samoa":0,"San Marino":0,"Sao Tome and Principe":0,"Saudi Arabia":26,"Senegal":0,"Seychelles":0,"Sierra Leone":0,"Serbia":3,"Singapore":2,"Slovakia":0,"Slovenia":0,"Solomon Islands":0,"Somalia":0,"South Africa":0,"South Georgia and the South Sandwich Islands":0,"Spain":2,"Sri Lanka":0,"St. Helena":0,"St. Pierre and Miquelon":0,"Sudan":3,"Suriname":0,"Svalbard and Jan Mayen Islands":0,"Swaziland":0,"Sweden":0,"Switzerland":0,"Syria":51,"Taiwan":2,"Tajikistan":2,"Tanzania":8,"Thailand":14,"Togo":0,"Tokelau":0,"Tonga":0,"Trinidad and Tobago":0,"Tunisia":22,"Turkey":7,"Turkmenistan":0,"Turks and Caicos Islands":0,"Tuvalu":0,"Uganda":1,"Ukraine":3,"UAE":15,"United Kingdom":4,"USA":7,"United States Minor Outlying Islands":0,"Uruguay":0,"Uzbekistan":1,"Vanuatu":0,"Venezuela":26,"Vietnam":36,"Wallis and Futuna Islands":0,"Western Sahara":0,"Yemen":3,"Yugoslavia":0,"Zambia":4,"Zimbabwe":0};
var parsedCountries = [];

function parseCountries() {
    var keys = Object.keys(data);
    for(var i = 0; i < keys.length ; i++) {
        if(data[keys[i]] > 0) {
            parsedCountries.push(keys[i]);
        }
    }
    createBar();
}

function createBar() {	
    if(!initializedGraph) {

        initializedGraph = true;
    	var margin = {top: 20, right: 20, bottom: 50, left: 70},
            width = $(document).width(),
            height = 200;

    	var svg = d3.select(".country-bar").append("svg")
    	    .attr("width", width)
    	    .attr("height", height + margin.top + margin.bottom)
      	.append("g")
        	.attr("transform","translate(0,20)");

        var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
        var y = d3.scaleLinear().range([height, 0]);
        
        x.domain(parsedCountries.map(function(d) { return d; }));

        /*data.forEach(function(d) {
            console.log(d);
            d.sales = +d.sales;
          });*/

        svg.append("g")
        	.attr("class", "axisBottom")
          	.attr("transform", "translate(0,0)")
          	.call(d3.axisBottom(x))
          .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)" );

    }

}


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

