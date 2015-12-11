var parseJsonForInsert = function(){

};

function insertQueryMaker(jsonObj){
	if(jsonObj.hasOwnProperty("table")){
		var data = jsonObj.data;
		var fieldNameStr = "(";
		var fieldValueStr = "(";
		for(var field in data){
			fieldNameStr+=field+",";
			if(typeof(data[field]) === "number"){
				fieldValueStr += data[field]+",";
			}else if(typeof(data[field]) === "string"){
				fieldValueStr += "\'" + data[field]+"\',";
			}
		}

		if(fieldNameStr[fieldNameStr.length-1] === ","){
			fieldNameStr[fieldNameStr.length-1] = '';
		}

		if(fieldValueStr[fieldValueStr.length-1] === ","){
			fieldValueStr[fieldValueStr.length-1] = '';
		}

		fieldNameStr = fieldNameStr.slice(0,fieldNameStr.length-1);
		fieldValueStr = fieldValueStr.slice(0,fieldValueStr.length-1);
		fieldNameStr+=")";
		fieldValueStr+=")";

		var finalStr = "INSERT INTO "+ jsonObj.table + " " + fieldNameStr + " VALUES " + fieldValueStr + ";";
		console.log(finalStr);
		return finalStr;
	}
	else{
		return null;
	}
}

var jsonObj = {
	table:"emp",
	data:{
		id:10,
		name:"xyz",
		salary:100000.0,
		dept:"computer",
	}
}

insertQueryMaker(jsonObj);
	