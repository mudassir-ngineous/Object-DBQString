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

function updateQueryMaker(jsonObj){
	if(jsonObj.hasOwnProperty("table")){
		var setData = jsonObj.set;
		var fieldUpdateStr = "";
		var conditionStr = "";
		for(var field in setData){
			
			if(typeof(setData[field]) === "number"){
				fieldUpdateStr += field + "=" + setData[field]+",";
			}else if(typeof(setData[field]) === "string"){
				fieldUpdateStr += field + "=" + "\'" + setData[field]+"\',";
			}
		}

		fieldUpdateStr = fieldUpdateStr.slice(0,fieldUpdateStr.length-1);
		var finalStr = "UPDATE " + jsonObj.table + " SET " + fieldUpdateStr;
		if(jsonObj.where){
			conditionStr = " where ";
			for(condition in jsonObj.where){

			}
		}

		finalStr += conditionStr;
		console.log(finalStr);
	}
};

var jsonObj = {
	table:"emp",
	set:{
		id:10,
		name:"xyz",
		salary:100000.0,
		dept:"computer",
	},
	where:{

	}
};

updateQueryMaker(jsonObj);

	