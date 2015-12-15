var parseJsonForInsert = function(){

};

function insertQueryMaker(jsonObj){
	if(jsonObj.hasOwnProperty("table")){
		var data = jsonObj.data;
		var fieldNameList = [];
		var fieldValueList = [];
		var fieldNameStr = "(";
		var fieldValueStr = "(";
		for(var field in data){
			fieldNameList.push(field);
			fieldValueList.push(getFormattedString(data[field]));
		}


		fieldNameStr += fieldNameList.join(",") + ")";
		fieldValueStr += fieldValueList.join(",") + ")";

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
			conditionStr += " WHERE "+ processConditionObj(jsonObj.where,"AND");
			if(conditionStr === " WHERE "){
				conditionStr="";
			}
		}

		finalStr += conditionStr;
		return finalStr;
	}else{
		return null;
	}
}

function deleteQueryMaker(jsonObj){
	if(jsonObj.hasOwnProperty("table")){
		var setData = jsonObj.set;
		var fieldUpdateStr = "";
		var conditionStr = "";

		var finalStr = "DELETE FROM " + jsonObj.table;
		if(jsonObj.where){
			conditionStr += " WHERE "+ processConditionObj(jsonObj.where,"AND");
			if(conditionStr === " WHERE "){
				conditionStr="";
			}
		}

		finalStr += conditionStr;
		return finalStr;
	}else{
		return null;
	}
}

function selectQueryMaker(jsonObj){
	if(jsonObj.hasOwnProperty("table") && jsonObj.hasOwnProperty("columns")){
		var finalStr="";
		var fieldStr="";
		var conditionStr="";

		if(jsonObj.columns.indexOf("*")>-1){
			fieldStr = "*"
		}else{
			fieldStr = jsonObj.columns.join(",");
		}

		if(jsonObj.where){
			conditionStr += " WHERE "+ processConditionObj(jsonObj.where,"AND");
			if(conditionStr === " WHERE "){
				conditionStr="";
			}
		}

		if(typeof(jsonObj.table) === 'object' && jsonObj.table.length>1){
			finalStr = "SELECT " + fieldStr + " FROM " + jsonObj.table.join(",") + conditionStr;
		}else{
			finalStr = "SELECT " + fieldStr + " FROM " + jsonObj.table + conditionStr;
		}
		

		return finalStr;
	}else{
		return null;
	}
};

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
	columns:["id","name","salary"],
	where:{
		"$or":[{"id":3},{"name":"gopinath"}]
	},
	orderbBy:[("id","asc"),("name","desc")],
	groupBy : ["id","name"],
	limit:10
};

a = selectQueryMaker(jsonObj);