//create by zhaoyang
var page = angular.module("dbBase", ['ngResource']);

page.factory("BaseDao", function($resource, $rootScope, $q) {
	var dao = {};
	dao.openDataBase = function(callback) {
		$rootScope.db = api.require('db');
		$rootScope.db.openDatabase({
			name : 'test'
		}, function(ret, err) {
			callback(ret)
		});
	}
	
	//创建多张表
	dao.createTableList = function(sqlList) {
		var status=$q.defer();
		$rootScope.db = api.require('db');
		$rootScope.db.transaction({
			name : 'test',
			operation : 'commit '
		}, function(ret, err) {
			for (var i = 0; i < sqlList.length; i++) {
				var isSuccess=dao.createTable(sqlList[i]);
				status.resolve(isSuccess);
			}
		});
		return status.promise;
	}
	//创建单表
	dao.createTable = function(sqlJson) {
		var data = $q.defer();
		//判断表是否存在
		$rootScope.db = api.require('db');
		var checkSql = "SELECT COUNT(1) as count FROM sqlite_master where type='table' and name='" + sqlJson.table + "'";
		$rootScope.db.selectSql({
			name : 'test',
			sql : checkSql
		}, function(ret, err) {
			if (ret.status) {
				if (ret.data[0].count > 0) {
					data.resolve(false);
				} else {
					var sql = contactSQL(sqlJson, 5);
					$rootScope.db.executeSql({
						name : 'test',
						sql : sql
					}, function(ret, err) {
						if (ret.status) {
							data.resolve(ret.status);
						} else {
							data.reject("出现异常");
						}
					});
				}
			} else {
				data.reject(err.msg);
			};
		});
		return data.promise;
	}
	//查询方法
	dao.selectRow = function(sql) {
		var reverse=sql.reverse;
		var data = $q.defer();
		var sql = contactSQL(sql, 1);
//		alert(sql);
		$rootScope.db = api.require('db');
		$rootScope.db.selectSql({
			name : 'test',
			sql : sql
		}, function(ret, err) {
			if (ret.status) {
				if(reverse){
					data.resolve(ret.data.reverse());
				}else{
					data.resolve(ret.data);
				}
			} else {
				data.reject(err.msg);
			};
		});
		return data.promise;
	}
	//添加方法
	dao.insertRow = function(sql,bid) {	
		var sqlJson=sql;
		var bid=bid;
		var data = $q.defer();
		if(bid!=undefined&&bid!=null){
		//判断记录是否存在
			var checkSql = "SELECT COUNT(1) as count FROM "+ sql.table + " where bid='"+bid+"' and dataStatus=1";
//			alert(checkSql);
			$rootScope.db = api.require('db');
			$rootScope.db.selectSql({
				name : 'test',
				sql : checkSql
			}, function(ret,err) {
//				alert(JSON.stringify(ret));
				if (ret.status) {
					if (ret.data[0].count > 0) {
						sqlJson.condition=[{
							'key' 	: 'bid',
							'value' : bid,
							'logic' : 'EQ'
							},{
							'key'   : 'dataStatus',
							'value' : 1,
							'logic' : 'EQ'
						}];
						var sql = contactSQL(sqlJson, 3);
//						alert(sql);
						$rootScope.db.executeSql({
							name : 'test',
							sql : sql
						}, function(ret, err) {
//							alert(JSON.stringify(ret));
							if (ret.status) {
								data.resolve(ret.status);
							} else {
								data.reject(err.msg);
							}
						});
					} else {						
						var sql = contactSQL(sqlJson, 2);
//						alert(sql);
						$rootScope.db.executeSql({
							name : 'test',
							sql : sql
						}, function(ret, err) {
//							alert(JSON.stringify(ret));
							if (ret.status) {
								data.resolve(ret.status);
							} else {
								data.reject(err.msg);
							}
						});
					}
				} else {
					data.reject(err.msg);
				};
		  });
		
	}else{
		var sql = contactSQL(sqlJson, 2);
		$rootScope.db = api.require('db');
		$rootScope.db.executeSql({
			name : 'test',
			sql : sql
		}, function(ret, err) {
			if (ret.status) {
				data.resolve(ret.status);
			} else {
				data.reject(err.msg);
			}
		});
	  }
		return data.promise;
	}

		
	//删除方法
	dao.deleteRow = function(sql) {
		var data = $q.defer();
		var sql = contactSQL(sql, 4);
		$rootScope.db = api.require('db');
		$rootScope.db.executeSql({
			name : 'test',
			sql : sql
		}, function(ret, err) {
			if (ret.status) {
				data.resolve(ret.status);
			} else {
				data.reject(err.msg);
			};
		});
		return data.promise;
	}
	//修改方法
	dao.updateRow = function(sql) {
		var data = $q.defer();
		var sql = contactSQL(sql, 3);
		$rootScope.db = api.require('db');
		$rootScope.db.executeSql({
			name : 'test',
			sql : sql
		}, function(ret, err) {
			if (ret.status) {
				data.resolve(ret.status);
			} else {
				data.reject(err.msg);
			};
		});
		return data.promise;
	}
	//删除表
	dao.dropTable = function(table) {
		var data = $q.defer();
		$rootScope.db = api.require('db');
		var sql = 'DROP TABLE ' + table;
		$rootScope.db.executeSql({
			name : 'test',
			sql : sql
		}, function(ret, err) {
			alert(JSON.stringify(ret));
			if (ret.status) {		
				data.resolve(ret.status);
			} else {
				data.reject(err.msg);
			};
		});
		return data.promise;
	}
	
	//查询表中的记录数
	dao.selectTableCount = function(table) {
		var data = $q.defer();
		$rootScope.db = api.require('db');
		var sql = 'SELECT count(1) as count FROM ' + table;
		$rootScope.db.selectSql({
			name : 'test',
			sql : sql
		}, function(ret, err) {
			if (ret.status) {
				data.resolve(ret.data[0].count);
			} else {
				data.reject(err.msg);
			};
		});
		return data.promise;
	}
	
	//查询表中当前的序列
	dao.selectCurrval = function(table) {
		var data = $q.defer();
		$rootScope.db = api.require('db');
		var sql = 'SELECT seq as currval FROM sqlite_sequence where name="' + table + '"';
		$rootScope.db.selectSql({
			name : 'test',
			sql : sql
		}, function(ret, err) {
			if (ret.status) {
				if (ret.data.length > 0) {
					data.resolve(ret.data[0].currval);
				} else {
					data.resolve(0);
				}
			} else {
				data.reject(err.msg);
			};
		});
		return data.promise;
	}
	//查询表中下一个序列
	dao.selectNextval = function(table) {
		var data = $q.defer();
		$rootScope.db = api.require('db');
		var sql = 'SELECT (seq+1) as nextval FROM sqlite_sequence where name="' + table + '"';
		$rootScope.db.selectSql({
			name : 'test',
			sql : sql
		}, function(ret, err) {
			if (ret.status) {
				if (ret.data.length > 0) {
					data.resolve(ret.data[0].nextval);
				} else {
					data.resolve(0);
				}
			} else {
				data.reject(err.msg);
			};
		});
		return data.promise;
	}
	//提取json关键字
	function contactSQL(sql, type) {
		var sqlStr = "";
		var tables = '';
		var cols = '';
		var vals = '';
		var colsAndVals = '';
		var condition = '';
		var groupBy = '';
		var having = '';
		var orderBy = '';
		var limits='';
		//table
		if (sql.table != undefined && sql.table != '') {
			tables = sql.table;
		}

		//cols
		if (sql.cols != undefined && sql.cols != '') {
			if (sql.cols.length > 0) {
				var colStr = '';
				for (var i = 0; i < sql.cols.length; i++) {
					colStr = colStr + sql.cols[i];
					if ((i + 1) < sql.cols.length) {
						colStr = colStr + ',';
					}
				}
				cols = colStr;
			}
		} else {
			cols = '*';
		}

		//vals
		if (sql.vals != undefined && sql.vals != '') {
			if (sql.vals.length > 0) {
				var valStr = '';
				for (var i = 0; i < sql.vals.length; i++) {
					valStr = valStr + '"'+sql.vals[i]+'"';
					if ((i + 1) < sql.vals.length) {
						valStr = valStr + ',';
					}
				}
				vals = valStr;
			}
		}

		//cols=vals
		if (sql.cols != undefined && sql.cols != '' && sql.vals != undefined && sql.vals != '') {
			if (sql.cols.length == sql.vals.length) {
				var str = '';
				for (var i = 0; i < sql.cols.length; i++) {
					str = str + sql.cols[i] + "=" +'"'+sql.vals[i]+'"';
					if ((i + 1) < sql.vals.length) {
						str = str + ',';
					}
				}
				colsAndVals = str;
			}
		}

		//join
		if (sql.join != undefined && sql.cols != '') {
			var joinStr = ' ';
			if (sql.join.length > 0) {
				for (var i = 0; i < sql.join.length; i++) {
					if (sql.join[i].way == 'none') {
						joinStr = joinStr + 'JOIN';
					} else if (sql.join[i].way == 'left') {
						joinStr = joinStr + 'LEFT JOIN';
					} else {
						joinStr = joinStr + 'RIGHT JOIN';
					}
					joinStr = joinStr + ' ' + sql.join[i].table + ' ON ' + sql.join[i].key + ' ';
				}
			}
			tables = tables + joinStr;
		}
		//where
		if (sql.condition != undefined && sql.condition != '') {
			if (sql.condition.length > 0) {
				for (var i = 0; i < sql.condition.length; i++) {
					var f = '';
					switch(sql.condition[i].logic) {
						case 'EQ' :
							f = '=';
							break;
						case 'LIKE' :
							f = ' LIKE ';
							break;
						case 'GT' :
							f = '>';
							break;
						case 'LT' :
							f = '<';
							break;
						case 'GE' :
							f = '>=';
							break;
						case 'LE' :
							f = '<=';
							break;
						case 'NE' :
							f = '=';
							break;
						case 'IN' :
							f = ' IN ';
							break;
						case 'NOTIN' :
							f = 'NOT IN';
							break;
						default :
							f = '=';
					}
					if (i >= 1) {
						condition = condition + ' AND '
					}
					condition = condition + sql.condition[i].key + f + "'"+sql.condition[i].value +"'"+' '
				}
			}
		}

		//group by
		if (sql.groupBy != undefined && sql.groupBy != '') {
			if (sql.groupBy.length > 0) {
				for (var i = 0; i < sql.groupBy.length; i++) {
					groupBy = groupBy + sql.groupBy[i];
					if ((i + 1) < sql.groupBy.length) {
						groupBy = groupBy + ",";
					}
				}
			}
		}

		// having
		if (sql.having != undefined && sql.having != '') {
			if (sql.having.length > 0) {
				for (var i = 0; i < sql.having.length; i++) {
					if (i >= 1) {
						having = having + " AND ";
					}
					having = having + sql.having[i].function;
				}
			}
		}

		//order by
		if (sql.orderBy != undefined && sql.orderBy != '') {
			if (sql.orderBy.length > 0) {
				for (var i = 0; i < sql.orderBy.length; i++) {
					orderBy = orderBy + sql.orderBy[i].col + " " + sql.orderBy[i].sort;
					if ((i + 1) < sql.orderBy.length) {
						orderBy = orderBy + ",";
					}
				}
			}
		}
		
		//limit 
		if (sql.limit != undefined && sql.limit != '') {
			if (sql.limit.length > 0) {
				limits=" limit "+sql.limit[1]+" offset "+sql.limit[0]
			}
		}
		
		var sqlArray = {};
		sqlArray.tables = tables;
		sqlArray.cols = cols;
		sqlArray.vals = vals;
		sqlArray.colsAndVals = colsAndVals;
		sqlArray.condition = condition;
		sqlArray.groupBy = groupBy;
		sqlArray.having = having;
		sqlArray.orderBy = orderBy;
		sqlArray.limits=limits;
		sqlStr = joinSQL(sqlArray, type);
		return sqlStr;
	}

	//根据传入类型，拼接不同 sql
	function joinSQL(array, type) {
		var sql = "";
		if (type == 1) {
			sql = "SELECT " + array.cols + " FROM " + array.tables;
			if (array.condition != "") {
				sql = sql + " WHERE " + array.condition;
			}
			if (array.groupBy != "") {
				sql = sql + " GROPU BY " + array.groupBy;
			}
			if (array.having != "") {
				sql = sql + " HAVING " + array.having;
			}
			if (array.orderBy != "") {
				sql = sql + " ORDER BY " + array.orderBy;
			}
			if(array.limits != ""){
				sql=sql+array.limits;
			}
		}
		if (type == 2) {
			sql = "INSERT INTO  " + array.tables + " ( " + array.cols + " ) values (" + array.vals + " )";
		}
		if (type == 3) {
			sql = "UPDATE " + array.tables + " SET " + array.colsAndVals + " WHERE " + array.condition;
		}
		if (type == 4) {
			sql = "DELETE FROM " + array.tables;
			if (array.condition != "") {
				sql = sql + " WHERE " + array.condition;
			}
		}
		//create table
		if (type == 5) {
			sql = "CREATE TABLE " + array.tables + " (" + array.cols + " )";
		}

		return sql;
	}

	return dao;
});
