//create by zhaoyang
var page = angular.module("messageDao", ['ngResource', 'dbBase']);

page.service("MessageDao", function($rootScope, $q, BaseDao) {

	//打开数据库
	this.openDataBase=function(callback){
		BaseDao.openDataBase(callback);
	}

	//初始化消息表，如果没有就进行创建
	this.initMessage=function(){
		var sqlJson = {
			"table" : "Message",
			"cols" : ['id Integer PRIMARY KEY autoincrement','type VARCHAR(255)','content VARCHAR(255)', 'contentType VARCHAR(255)', 'fromUserId VARCHAR(255)', 'fromUserName VARCHAR(15)', 'fromUserPic VARCHAR(255)', 'answerId VARCHAR(255)','feedbackId VARCHAR(255)','monitorId VARCHAR(255)','complainId VARCHAR(255)','time Date']
		};
		return BaseDao.createTable(sqlJson);
	};

	//查找消息列表
	this.findMessage=function(){
		var sqlJson = {
			"table" : "Message",
			"cols" : ['id', 'type', 'content', 'contentType','fromUserId','fromUserName','fromUserPic','answerId','feedbackId','monitorId','complainId','time'],
			"orderBy" : [
				{
					"col"  : 'time',
					"sort" : 'desc'
				}
			]
		};
		return BaseDao.selectRow(sqlJson);
	};

	//插入消息方法
	this.addMessage = function(message) {
		var sqlJson = {
			"table" : "Message",
			"cols" : ['type', 'content', 'contentType','fromUserId','fromUserName','fromUserPic','answerId','feedbackId','monitorId','complainId','time'],
				"vals" : [message.type,message.content,message.contentType,message.fromUserId,message.fromUserName,message.fromUserPic,message.answerId,message.feedbackId,message.monitorId,message.complainId,message.time]
			};
		return BaseDao.insertRow(sqlJson);
	};

	//更新消息方法
	this.updateMessage = function(message,key,value) {
		var sqlJson = {
			"table" : "Message",
			"cols" : ['type', 'content', 'contentType','fromUserId','fromUserName','fromUserPic','answerId','feedbackId','monitorId','complainId','time'],
			"vals" : [message.type,message.content,message.contentType,message.fromUserId,message.fromUserName,message.fromUserPic,message.answerId,message.feedbackId,message.monitorId,message.complainId,message.time],
			"condition" : [
				{
					'key' : key,
					'value' : value,
					'logic' : 'EQ'
				}
			]
		};
		return BaseDao.updateRow(sqlJson);
	};
});
