query_str = "http://api.census.gov/data/2014/intltrade/istnaics?get=GEN_VAL_YR,STATE&YEAR=2014&NAICS=3241&CTY_CODE";

var var_name,
	num_data,
	json_data,
	api_data,
	jsonArr;

//var api_data = 
api_data = $.getJSON(query_str,function(data){
	return data;
});

	//console.log(data);
	//return data;
	var_name = api_data[0];
	num_data = api_data.splice(1,api_data.length-1);

//	var json_data = eval('{ '+"imports" +":"+ '['+
//		'{' +toString(var_name[0])+':'+num_data[0][0]+","+
//		  toString(var_name[1])+':'+num_data[0][1]+","+
//		toString(var_name[2])+':'+num_data[0][2]+","+
//		toString(var_name[3])+':'+num_data[0][3]+","+
//		toString(var_name[4])+':'+num_data[0][4]+","+
//	'}' +'],}');
	var jsonArr = [];
	//console.log(json_data);
	for (i=0; i < num_data.length;i++){
			jsonArr.push({
				GEN_VAL_YR: num_data[i][0],
				STATE: num_data[i][1],
				YEAR: num_data[i][2],
				NAICS: num_data[i][3],
				CTY_CODE: num_data[i][4]
			})
	}
	console.log(jsonArr);