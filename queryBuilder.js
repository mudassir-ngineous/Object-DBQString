"use strict";
class queryBuilder{
	constructor(db_name){
		this.database = db_name;
	}

	var getDatabaseName = function(){
		console.log(this.database);
	}
};

var q = queryBuilder("mysql");

console.log(q.getDatabaseName());