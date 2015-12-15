var parseJsonForInsert = function(){

};

function insertQueryMaker(jsonObj){
	if(jsonObj.hasOwnProperty("table")){
		var data = jsonObj.data;
		var fieldNameStr = "(";
		var fieldValueStr = "(";
		for(var field in data){
			fieldNameStr+=field+",";
			fieldValueStr += getFormattedString(data[field]) + ","
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
			fieldUpdateStr += field + "=" + getFormattedString(setData[field]) + ",";			
		}

		fieldUpdateStr = fieldUpdateStr.slice(0,fieldUpdateStr.length-1);
		var finalStr = "UPDATE " + jsonObj.table + " SET " + fieldUpdateStr;
		if(jsonObj.where){
			conditionStr += " WHERE "+processConditionObj(jsonObj.where,"AND");
			if(conditionStr === " WHERE "){
				conditionStr="";
			}
		}

		finalStr += conditionStr;
		console.log(finalStr);
	}
}


function conditionParser(condObj,operator){
	var conditionString = "";
	var conditions = [];

	for(var field in condObj){
		var temp = field + "=" + getFormattedString(condObj[field]);
		if(field === "$or"){
			conditionParser(condObj[field],field);
		}
		conditions.push(temp);
	}
	console.log(conditions);

	return conditionString;
}

function getFormattedString(s){
	if(typeof(s) === "number"){
		return s;
	}else if(typeof(s) === "string"){
		return "\'" + s + "\'";
	}
}

function processConditionObj(cond_obj,operator){
	var where_list=[];

	if(cond_obj.length !== undefined && typeof(cond_obj) === 'object'){
		for(var i=0;i<cond_obj.length;i++){
			where_list.push(processConditionObj(cond_obj[i],"="));
		}
	}else if(cond_obj.length === undefined && typeof(cond_obj) === 'object'){
		for(var field in cond_obj){
			if(field === "$or"){
				where_list.push(processConditionObj(cond_obj[field],"or"));
			}else{
				if(typeof(cond_obj[field]) === 'object'){
					if(cond_obj[field].hasOwnProperty("$lt")){
						where_list.push(field + getOperator("$lt") + getFormattedString(cond_obj[field]["$lt"]));
					}
					if(cond_obj[field].hasOwnProperty("gt")){
						where_list.push(field + getOperator("gt") + getFormattedString(cond_obj[field]["gt"]));
					}
					if(cond_obj[field].hasOwnProperty("$lte")){
						where_list.push(field + getOperator("$lte") + getFormattedString(cond_obj[field]["$lte"]));
					}
					if(cond_obj[field].hasOwnProperty("$gte")){
						where_list.push(field + getOperator("$gte") + getFormattedString(cond_obj[field]["$gte"]));
					}
					if(cond_obj[field].hasOwnProperty("$ne")){
						where_list.push(field + getOperator("$ne") + getFormattedString(cond_obj[field]["$ne"]));
					}
				}else{
					where_list.push(field + "=" + getFormattedString(cond_obj[field]));	
				}
			}
		}
	}
	
	where_clause = where_list.join(" "+operator.toUpperCase()+" ");
	if(where_list.length === 1){
		return where_clause;
	}else if(where_list.length > 1){
		return "(" + where_clause + ")";
	}	
};

function greaterThanString(gtObj){

}

function lessThanString(ltObj){

}

function gteString(gteObj){

}

function lteString(lteObj){

}

function orString(orObj){

}

function getOperator(str){
	switch(str){
		case "$lt": return "<";
		case "$gt": return ">";
		case "$lte": return "<=";
		case "$gte": return ">=";
		case "$ne":return "!=";  //depends on database type as in some cases, <> is not equal to
		case "$or": return "OR";
		case "$and":return "AND";
	}
}

var jsonObj = {
	table:"emp",
	set:{
		name:"xyz",
		salary:100000.0,
		dept:"computer",
	},
	where:{
		"$or":[{id:3},{name:"gopinath"}]
	}
};

updateQueryMaker(jsonObj);

