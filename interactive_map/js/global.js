/* Global Variables */

var sample_data = {"Germany":{"coauthors":440,"count":"eudeu"},"China":{"coauthors":325,"count":"aschn"},"United Kingdom":{"coauthors":291,"count":"eugbr"},"France":{"coauthors":224,"count":"eufra"},"South Korea":{"coauthors":216,"count":"askor"},"Taiwan":{"coauthors":145,"count":"astwn"},"Italy":{"coauthors":139,"count":"euita"},"Japan":{"coauthors":134,"count":"asjpn"},"Canada":{"coauthors":126,"count":"nacan"},"Switzerland":{"coauthors":123,"count":"euche"},"Australia":{"coauthors":120,"count":"ocaus"},"Netherlands":{"coauthors":114,"count":"eunld"},"Chile":{"coauthors":89,"count":"aschl"},"Greece":{"coauthors":75,"count":"eugrc"},"Spain":{"coauthors":75,"count":"euesp"},"Russia":{"coauthors":74,"count":"asrus"},"Singapore":{"coauthors":73,"count":"assgp"},"Denmark":{"coauthors":70,"count":"eudnk"},"Israel":{"coauthors":62,"count":"asisr"},"Czech Republic":{"coauthors":61,"count":"eucze"},"Argentina":{"coauthors":49,"count":"saarg"},"India":{"coauthors":48,"count":"asind"},"Saudi Arabia":{"coauthors":46,"count":"assau"},"Brazil":{"coauthors":41,"count":"sabra"},"Norway":{"coauthors":38,"count":"eunor"},"Belgium":{"coauthors":32,"count":"eubel"},"Peru":{"coauthors":24,"count":"saper"},"Slovenia":{"coauthors":22,"count":"eusvn"},"New Zealand":{"coauthors":21,"count":"ocnzl"},"Sweden":{"coauthors":18,"count":"euswe"},"Turkey":{"coauthors":18,"count":"astur"},"Austria":{"coauthors":16,"count":"euaut"},"Finland":{"coauthors":15,"count":"eufin"},"Mexico":{"coauthors":12,"count":"samex"},"Thailand":{"coauthors":12,"count":"astha"},"Malaysia":{"coauthors":9,"count":"asmys"},"Bolivia":{"coauthors":7,"count":"eubol"},"Colombia":{"coauthors":7,"count":"sacol"},"Uganda":{"coauthors":6,"count":"afuga"},"Iceland":{"coauthors":5,"count":"euisl"},"Panama":{"coauthors":5,"count":"napan"},"Portugal":{"coauthors":5,"count":"euprt"},"South Africa":{"coauthors":5,"count":"afzaf"},"Costa rica":{"coauthors":4,"count":"nacri"},"Ethiopia":{"coauthors":4,"count":"afeth"},"Ireland":{"coauthors":4,"count":"euirl"},"Lithuania":{"coauthors":4,"count":"eultu"},"Qatar":{"coauthors":4,"count":"asqat"},"Venezuela":{"coauthors":4,"count":"saven"},"Iran":{"coauthors":3,"count":"asirn"},"Morocco":{"coauthors":3,"count":"afmar"},"Algeria":{"coauthors":2,"count":"afdza"},"Cote Ivoire":{"coauthors":2,"count":"afciv"},"Hungary":{"coauthors":2,"count":"euhun"},"Indonesia":{"coauthors":2,"count":"asidn"},"Kenya":{"coauthors":2,"count":"afken"},"Libya":{"coauthors":2,"count":"aflby"},"Philippines":{"coauthors":2,"count":"asphl"},"Sri lanka":{"coauthors":2,"count":"aslka"},"Surinam":{"coauthors":2,"count":"sasur"},"Uruguay":{"coauthors":2,"count":"saury"},"Cameroon ":{"coauthors":1,"count":"afcmr"},"Croatia":{"coauthors":1,"count":"euhrv"},"Guatemala":{"coauthors":1,"count":"nagtm"},"Guinea":{"coauthors":1,"count":"afgin"},"Honduras":{"coauthors":1,"count":"nahnd"},"Lebanon":{"coauthors":1,"count":"aslbn"},"Mauritania":{"coauthors":1,"count":"afmrt"},"Nepal":{"coauthors":1,"count":"asnpl"},"Nicaragua":{"coauthors":1,"count":"nanic"},"Oman":{"coauthors":1,"count":"asomn"},"Poland":{"coauthors":1,"count":"eupol"},"Serbia":{"coauthors":1,"count":"eusrb"},"Sierra Leone":{"coauthors":1,"count":"afsle"},"Ukraine":{"coauthors":1,"count":"euukr"}};

var selectColor = "#9999cc", current, currentData = [],

    filteredData = [], worldMap = true, currentColorScheme = "warm",

    clicked = false, worldData = {}, usaData = {}, initialized = false, noCoauthors = [];

var stateHashMap = {"Hawaii":"HI", "Alaska":"AK", "Florida":"FL", "South Carolina":"SC", "Georgia":"GA", "Alabama":"AL", 
        "North Carolina":"NC", "Tennessee":"TN", "Rhode Island":"RI", "Connecticut":"CT", "Massachusetts":"MA",
        "Maine":"ME", "New Hampshire":"NH", "Vermont":"VT", "New York":"NY", "New Jersey":"NJ", "Pennsylvania":"PA", 
        "Delaware":"DE", "Maryland":"MD", "West Virginia":"WV", "Kentucky":"KY", "Ohio":"OH", "Michigan":"MI", 
        "Wyoming":"WY", "Montana":"MT", "Idaho":"ID", "Washington":"WA", "District of Columbia":"DC", "Texas":"TX", "California":"CA", 
        "Arizona":"AZ", "Nevada":"NV", "Utah":"UT", "Colorado":"CO", "New Mexico":"NM", "Oregon":"OR", "North Dakota":"ND", 
        "South Dakota":"SD", "Nebraska":"NE", "Iowa":"IA", "Mississippi":"MS", "Indiana":"IN", "Illinois":"IL", "Minnesota": "MN", 
        "Wisconsin":"WI", "Missouri":"MO", "Arkansas":"AR", "Oklahoma":"OK", "Kansas":"KS", "Louisiana":"LA", "Virginia":"VA", "Puerto Rico":"PR"};

var colors = ['#fed976','#ffcc33','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'],

    warmColorScheme = ['#fed976','#ffcc33','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'],

    coldColorScheme = ['#e0f3db','#ccebc5','#a8ddb5','#7bccc4','#4eb3d3','#2b8cbe','#0868ac','#084081'];

var colorMap = {"0":"#ddd" ,"50":"#fed976", "100":"#ffcc33", "150":"#feb24c", "200":"#fd8d3c", "250":"#fc4e2a", "300":"#e31a1c", "350":"#bd0026", "351+":"#800026"},

    warmColorMap = {"0":"#ddd" ,"50":"#fed976", "100":"#ffcc33", "150":"#feb24c", "200":"#fd8d3c", "250":"#fc4e2a", "300":"#e31a1c", "350":"#bd0026", "351+":"#800026"},

    coldColorMap = {"0":"#ddd" ,"50":"#e0f3db", "100":"#ccebc5", "150":"#a8ddb5", "200":"#7bccc4", "250":"#4eb3d3", "300":"#2b8cbe", "350":"#0868ac", "351+":"#084081"};
