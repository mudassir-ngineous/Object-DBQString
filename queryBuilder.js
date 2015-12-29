var mysql = require("./dbs/mysql.js");
var postgreSQL = require("./dbs/postgreSQL.js");
var oracle = require("./dbs/oracle.js");
var sqlServer = require("./dbs/sqlServer.js");
var sqlite = require("./dbs/sqlite.js");

function init(db){
	switch(db.toLowerCase()){
		case "mysql": 		return mysql.obj;
		case "postgresql": 	return postgreSQL.obj;
		case "oracle": 		return oracle.obj;
		case "sqlserver": 	return sqlServer.obj;
		case "sqlite": 		return sqlite.obj;
		default: 			return null;
	}
}

module.exports = function(db){
	return init(db);
};