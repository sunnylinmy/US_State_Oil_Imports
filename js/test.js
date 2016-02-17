query_str_import = "http://api.census.gov/data/2014/intltrade/istnaics?get=GEN_VAL_YR,STATE&YEAR=2014&NAICS=3241&CTY_CODE";

var var_name,
	num_data,
	json_data,
	colors,
	jsonArr=[],
	stateData;

//Accessors that specify the variables
function val(d) {return d.GEN_VAL_YR;};
function state(d) {return d.STATE;};
function year(d) {return d.year;};
function naics(d) {return d.NAICS;};
function cty(d) {return d.CTY_CODE;};

var width = 960;
var height = 500;

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]); 

var path = d3.geo.path()
    .projection(projection);

d3.json('data/us-states-segmentized-2.topojson', function(error, us) {
	topology = us;
	geometries = topology.objects.states.geometries;

    svg.append('path')
        .datum(topojson.feature(us, us.objects.states))
        .attr('class', 'states') // defined in CSS
        .attr('d', path);
});


d3.json(query_str_import, function(data){
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
				STATE_VAL: Number(sumByState),
				STATE: stateName[i],
				YEAR: jsonArr[1].YEAR,
				NAICS: jsonArr[1].NAICS,
		});
	};
			console.log(sumByState_json);
			stateData = sumByState_json;
});


//d3.json("data/us-states-segmentized-2.topojson", function(us){
//	topology = us;
//	geometries = topology.objects.states.geometries;

//	d3.json(query_str_import, function(data){
//		var_name = data[0];
//		num_data = data.splice(1,data.length-1);
//
//		for (i=0; i < num_data.length;i++){
//			jsonArr.push({
//				GEN_VAL_YR: Number(num_data[i][0]),
//				STATE: num_data[i][1],
//				YEAR: num_data[i][2],
//				NAICS: num_data[i][3],
//				CTY_CODE: num_data[i][4]
//			})
//		}
//		sortedState = jsonArr.map(state).sort(d3.ascending);
//
//		var stateName;
//		stateName=unique(sortedState);
//
//		var sumByState_json = [];
//		
//		for (i=0;i<stateName.length;i++){
//			var sumByState = 0;
//			var states_json = [];
//			states_json = filterJSON(jsonArr,'STATE',stateName[i]);
//
//			for (j=0;j<states_json.length;j++){
//				sumByState = sumByState*1+Number(states_json[j].GEN_VAL_YR);
//			}
//			sumByState_json.push({
//				STATE_VAL: Number(sumByState),
//				STATE: stateName[i],
//				YEAR: jsonArr[1].YEAR,
//				NAICS: jsonArr[1].NAICS,
//		});
//	};

//		data = sumByState_json;
//		rawData = data;
//		dataByState = d3.nest().key(function(d){return d.STATE;}).rollup(function(d){return d[0];})
//						.map(data);
//		//console.log(data)
//		//dataByState = d3.nest().key(function(d) {return d.})
//		svg.append("g").attr("class","states")
//	   		.selectAll("path").data(topojson.feature(us,us.objects.states).features)
//	   		.enter().append("path")
//	   		.attr("class",function(d){ return quantize(dataByState.get(d.STATE));})
//	   		.attr("d",path);
//
//		svg.append("path")
//    		.datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
//      		.attr("class", "states")
//      		.attr("d", path);
//
//	});
//});

//d3.select(self.frameElement).style("height", height + "px");

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

