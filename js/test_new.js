query_str_import = "http://api.census.gov/data/2014/intltrade/istnaics?get=GEN_VAL_YR,STATE&YEAR=2014&NAICS=3241&CTY_CODE";


function val(d) {return d.GEN_VAL_YR;};
function state(d) {return d.STATE;};
function year(d) {return d.year;};
function naics(d) {return d.NAICS;};
function cty(d) {return d.CTY_CODE;};
function state_val(d) {return d.STATE_VAL;};

var colors = colorbrewer.RdYlBu[5]
            .reverse()
            .map(function(rgb) { return d3.hsl(rgb); });

var var_name,
	num_data,
	json_data,
	colors,
	jsonArr=[],
	stateData;

var width = 1200,
  	height = 500;

  var div = d3.select("body").append("div")   
  .attr("class", "tooltip")               
  .style("opacity", 0);

  var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("margin", "10px auto");

  var projection = d3.geo.albers()
  .rotate([-105, 0])
  .center([-10, 65])
  .parallels([52, 64])
  .scale(700)
  .translate([width / 2, height / 2]);

  var projection = d3.geo.albersUsa().translate([width / 2, height / 2]);

  var path = d3.geo.path().projection(projection);

  //Reading map file and data

  queue()
  .defer(d3.json, 'data/us-states-new.topojson')
  .defer(d3.json, query_str_import)
  .await(ready);

function ready(error, map, data) {
    var rateById = {};
    var nameById = {};

   	var_name = data[0];
	num_data = data.splice(1,data.length-1);

		for (i=0; i < num_data.length;i++){
			jsonArr.push({
				GEN_VAL_YR: Number(num_data[i][0]),
				STATE: num_data[i][1],
				YEAR: num_data[i][2],
				NAICS: num_data[i][3],
				CTY_CODE: num_data[i][4]
			})
		}
		sortedState = jsonArr.map(state).sort(d3.ascending);


		var stateName;
		stateName=unique(sortedState);

		var sumByState_json = [];
		
		for (i=0;i<stateName.length;i++){
			var sumByState = 0;
			var states_json = [];
			states_json = filterJSON(jsonArr,'STATE',stateName[i]);

			for (j=0;j<states_json.length;j++){
				sumByState = sumByState*1+Number(states_json[j].GEN_VAL_YR);
			}
			sumByState_json.push({
				STATE_VAL: Number(sumByState)/(1000000),
				STATE: stateName[i],
				YEAR: jsonArr[1].YEAR,
				NAICS: jsonArr[1].NAICS,
		});
	};

	sortedSum  = sumByState_json.map(state_val).sort(d3.ascending);
	lo = sortedSum[0];
	hi = sortedSum[sortedSum.length-1];

	
   sumByState_json.forEach(function(d) {
    	rateById[d.STATE] = +d.STATE_VAL;
    	nameById[d.STATE] = d.STATE;
  });

  //Drawing Choropleth

var color = d3.scale.linear().domain([1, 10, 100, 1000, 10000])
    .range(['#f7f7f7','#cccccc','#969696','#636363','#252525']);

  svg.append("g")
  .attr("class", "region")
  .selectAll("path")
  .data(topojson.feature(map, map.objects.collection).features)
  .enter().append("path")
  .attr("d", path)
  .attr("fill",function(d) {return color(rateById[d.properties.NAME]);})
  //.attr("class", function(d) {return quantize(rateById[d.properties.NAME]);})
  .attr("id",function(d) {
              return d.properties.NAME;})
  .style("opacity", 0.8)
  .on("mouseover", function(d) {
   	d3.select(this).transition().duration(300).style("opacity", 1).attr("fill","rgb(8,81,156)");

    div.transition().duration(300)
    .style("opacity", 1);

    div.text(nameById[d.properties.NAME] + " : " + rateById[d.properties.NAME].toFixed(2)+"Million")
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY -30) + "px");
  })
  .on("mouseout", function() {
    d3.select(this)
    .transition().duration(300)
    .style("opacity", 0.8).attr("fill",function(d) {return color(rateById[d.properties.NAME]);});

    div.transition().duration(300)
    .style("opacity", 0);
  });
};


var unique = function(xs) {
  var seen = {}
  return xs.filter(function(x) {
    if (seen[x])
      return
    seen[x] = true
    return x
  })
};

function filterJSON(json, key, value) {
    var result = [];
    for (var indicator in json) {
        if (json[indicator][key] === value) {
            result.push(json[indicator]);
        }
    }
    return result;
};
