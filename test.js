var db = require("./queryBuilder.js")("sqlite");

var jsonObj = {
	table:"emp",
	columns:["id","name","salary"],
	where:{
		"$or":[{"id":3},{"name":"gopinath"}]
	},
	orderbBy:[("id","asc"),("name","desc")],
	groupBy : ["id","name"],
	limit:10,
	distinct:true
};

var str = db.select(jsonObj);
console.log(str);