/* r, a, mg, g, d  --> id tags  */
/* 1, 2, 3,  4, 5  --> group #  */
/* {"source": "Napoleon", "target": "Myriel", "value": 1} */



var records = [], artists = [], musicalGroups = [], genres = [], distributors = [], dataset = {"nodes":[],"links":[]};
var rD = {}, aD = {}, mgD = {}, gD = {}, dD = {}, radialDictG = {}, radialDict = {}, radialMatrix=[], yearLinks = {}, linkDict = {}, sortByAlbum = {}, sortByArtist = {}, sortByMG = {};
var fields = ["artist","genre","musical_group","distributor", "album"];


var additional = {};
d3.json("data/collection.json", function(error, data) {
  data = (data.collection).record;
  var keys = Object.keys(data);

  for(var i = 0 ; i < keys.length ; i++) {
    var record = {"distributor":[],"person":[],"musical_group":[],"geo_code":[],"album":[],"artist":[],"media_type":[],"songs":[],"genre":[]};
    var info = (data[keys[i]]).datafield;
    var rec = "", years = "", loc = "";
    for(var j = 0 ; j < info.length ; j++) {
      tag = info[j].tag;
      subfield = info[j].subfield;

      for(var k = 0 ; k < subfield.length ; k++) {
        var code = subfield[k].tag_code, text = subfield[k].tag_text;
        if(tag === "650") {
          if(code === "y") years = text; 
          if(code === "z") loc = text;
        } else if (tag === "856") {
          if(code === "z") loc = text;
        } else if (tag === "245") {
          if(code === "a") {
            
            rec = text;
          }
        }
        if(rec == ""){
          rec = "Record"+i;
        }
      }
    }
    completeYrs = [];

    tmp = years.split("-");
    tmp = [parseInt(tmp[0]),parseInt(tmp[1])];
    if(!isNaN(tmp[0])) {
      if(tmp[0] >= 1960 && tmp[0] <= 1965) completeYrs.push("60to65");
      if(tmp[0] >= 1966 && tmp[0] <= 1970) completeYrs.push("66to70");
      if(tmp[0] >= 1971 && tmp[0] <= 1975) completeYrs.push("71to75");
      if(tmp[0] >= 1976 && tmp[0] <= 1980) completeYrs.push("76to80");
      if(tmp[0] >= 1981 && tmp[0] <= 1985) completeYrs.push("81to85");
      if(tmp[0] >= 1986 && tmp[0] <= 1990) completeYrs.push("86to90");
      if(tmp[0] >= 1991 && tmp[0] <= 2000) completeYrs.push("91to00");
      if(tmp[0] >= 2001 && tmp[0] <= 2200) completeYrs.push("00to05");
    }
    if(!isNaN(tmp[1])) {
      if(tmp[1] >= 1960 && tmp[1] <= 1965) completeYrs.push("60to65");
      if(tmp[1] >= 1966 && tmp[1] <= 1970) completeYrs.push("66to70");
      if(tmp[1] >= 1971 && tmp[1] <= 1975) completeYrs.push("71to75");
      if(tmp[1] >= 1976 && tmp[1] <= 1980) completeYrs.push("76to80");
      if(tmp[1] >= 1981 && tmp[1] <= 1985) completeYrs.push("81to85");
      if(tmp[1] >= 1986 && tmp[1] <= 1990) completeYrs.push("86to90");
      if(tmp[1] >= 1991 && tmp[1] <= 2000) completeYrs.push("91to00");
      if(tmp[1] >= 2001 && tmp[1] <= 2200) completeYrs.push("00to05");
    }

    additional[i] = {"years":completeYrs,"loc":loc};

  }

  d3.json("data/records_collection.json", function(error, info) {
    /* Create nodes. */
    radialMatrix.push(["id,value"],["Collection,"],["Collection.Artists,"],["Collection.Genres,"],["Collection.Musical-Groups,"],["Collection.Distributors,"],["Collection.Records,"]);
    for(var i=0 ; i<info.length ; i++) {
      record = info[i];
      var radialAdd = "";
      linkDict[""] = [];

      /* Record Links. */
      if(record.album[0] && record.album[0] != "") {
        sortByAlbum[record.album[0]] = info[i];

        radialAdd = "Collection.Records."+record.album[0];

        if((additional[i].years).length > 0) {
          yearLinks[radialAdd] = additional[i]["years"];
        } else {
          yearLinks[radialAdd] = [];
        }

        linkDict[record.album[0]] = [];

        for(let j of fields) {
          if(record[j][0] && record[j][0] != "" && j != "record") {
            (linkDict[record.album[0]]).push(record[j][0]);
          }
        }

      } else {
        sortByAlbum["Record"+i] = info[i];
        sortByAlbum["Record"+i].album = ["Record"+i];

        if((additional[i].years).length > 0) {
          yearLinks[radialAdd] = additional[i]["years"];
        } else {
          yearLinks[radialAdd] = [];
        }

        radialAdd = "Collection.Records.Record"+i;
        linkDict["Record"+i] = [];

        for(let j of fields) {
          if(record[j][0] && record[j][0] != "") {
            (linkDict["Record"+i]).push(record[j][0]);
          }
        }
      }

      if(!radialDict[radialAdd]) {
        radialDict[radialAdd] = 0;
      } 
      
      /* Artist Links. */
      if(record.artist[0] && record.artist[0] != "") {
        var stripped = (record.artist[0]).replace(/\s+/g, '');
        radialAdd = "Collection.Artists."+stripped;

        sortByArtist[stripped] = info[i];

        if((additional[i].years).length > 0) {
          yearLinks[radialAdd] = additional[i]["years"];
        } else {
          yearLinks[radialAdd] = [];
        }

        if(!radialDict[radialAdd]) {
          radialDict[radialAdd] = 0;
        }
        if(linkDict[stripped]) {
          for(let j of fields) {
            if(record[j][0] && record[j][0] != "" && j != "genre") {
              (linkDict[stripped]).push(record[j][0]);
            }
          }
        } else {
          linkDict[stripped] = [];
          for(let j of fields) {
            if(record[j][0] && record[j][0] != "" && j != "genre") {
              (linkDict[stripped]).push(record[j][0]);
            }
          }
        }
      }

      /* Genre Links. */
      if(record.genre[0] && record.genre[0] != "") {
        var stripped = (record.genre[0]).replace(/\s+/g, '');
        radialAdd = ("Collection.Genres."+stripped).trim();

        if((additional[i].years).length > 0) {
          yearLinks[radialAdd] = additional[i]["years"];
        } else {
          yearLinks[radialAdd] = [];
        }

        if(!radialDictG[radialAdd]) {
          radialDictG[radialAdd] = 0;
        } 
        if(linkDict[stripped]) {
          for(let j of fields) {
            if(record[j][0] && record[j][0] != "" && j != "genre") {
              (linkDict[stripped]).push(record[j][0]);
            }
          }
        } else {
          linkDict[stripped] = [];
          for(let j of fields) {
            if(record[j][0] && record[j][0] != "" && j != "genre") {
              (linkDict[stripped]).push(record[j][0]);
            }
          }
        }
      }

      /* Musical Group Links. */
      if(record.musical_group[0] && record.musical_group[0] != "") {
        var stripped = (record.musical_group[0]).replace(/\s+/g, '');
        radialAdd = "Collection.Musical-Groups."+stripped;

        if((additional[i].years).length > 0) {
          yearLinks[radialAdd] = additional[i]["years"];
        } else {
          yearLinks[radialAdd] = [];
        }
        sortByMG[stripped] = info[i];
        if(!radialDict[radialAdd]) {
          radialDict[radialAdd] = 0;
        }
        if(linkDict[stripped]) {
          for(let j of fields) {
            if(record[j][0] && record[j][0] != "" && j != "distributor") {
              (linkDict[stripped]).push(record[j][0]);
            }
          }
        } else {
          linkDict[stripped] = [];
          for(let j of fields) {
            if(record[j][0] && record[j][0] != "" && j != "distributor") {
              (linkDict[stripped]).push(record[j][0]);
            }
          }
        }
      }

      /* Distributor Links. */
      if(record.distributor[0] && record.distributor[0] != "") {
        var stripped = (record.distributor[0]).replace(/\s+/g, '');
        radialAdd = "Collection.Distributors."+stripped;

        if((additional[i].years).length > 0) {
          yearLinks[radialAdd] = additional[i]["years"];
        } else {
          yearLinks[radialAdd] = [];
        }
        if(!radialDict[radialAdd]) {
          radialDict[radialAdd] = 0;
        }
        if(linkDict[stripped]) {
          for(let j of fields) {
            if(record[j][0] && record[j][0] != "" && j != "distributor") {
              (linkDict[stripped]).push(record[j][0]);
            }
          }
        } else {
          linkDict[stripped] = [];
          for(let j of fields) {
            if(record[j][0] && record[j][0] != "" && j != "distributor") {
              (linkDict[stripped]).push(record[j][0]);
            }
          }
        }
      }
    }

    //console.log(JSON.stringify(radialMatrix));

    for (var i=0 ; i<(Object.keys(radialDictG)).length ;i++) {

      var item = (Object.keys(radialDictG))[i];
      radialMatrix.push([item,300+(i*2)]);
    }

    for (var i=0 ; i<(Object.keys(radialDict)).length ;i++) {

      var item = (Object.keys(radialDict))[i];
      radialMatrix.push([item,300+(i*2)]);
    }

    //console.log(linkDict);

  var data = radialMatrix;
  var csvContent = "data:text/csv;charset=utf-8,";
  data.forEach(function(infoArray, index){
     dataString = infoArray.join(",");
     csvContent += index < data.length ? dataString+ "\n" : dataString;
  }); 


  // var encodedUri = encodeURI(csvContent);
  // window.open(encodedUri);


  });


});




















