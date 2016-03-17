// 问题的操作
var page = angular.module("problemService", ['storage','commonDirect']);

page.service("ProblemService", function($rootScope,$http,Store,Common) {

    var url = Common.baseURL + '/question/';

    //悬赏列表 参数limit,page,subject
    this.listByPage = function(questionQueryInput) {
        return $http({
            method : 'GET',
            params:questionQueryInput,
            url : url + 'list'
        });
    };

    this.myCollect = function(collectionQueryInput){
        return $http({
            method: 'GET',
            params: collectionQueryInput,
            url: url + 'myCollect'
        })
    }

    //查询问题列表 应用场景:1.我的提问-获取问题列表(传参:askUserBid)
    this.query = function(questionQueryInput){
        return $http.post(url + 'query', questionQueryInput);
    };

    //查询问题列表 应用场景:1.我的回答-获取问题列表(传参:answerUserBid, page, limit)
    this.listBids = function(questionQuery){
        return $http.post(url + 'listBids', questionQuery);
    };

    //根据年级获取科目 1.悬赏列表 科目 标签
    this.listSubject = function(){
        return $http.get(url + 'subjects')
    };

    //获取问题详情 应用场景:1.我的提问-获取问题详情 2.悬赏列表-获取问题详情
    this.getDetail = function(questionId){
        return $http.get(url + 'detail?questionId=' + questionId);
    };

    //问题举报/答案举报  应用场景:1.问题详情-举报 2.回答详情-举报 (传参 report{type(QUESTION,ANSWER), questionId, content})
    this.report = function(reportData){
        return $http({
            method : 'POST',
            data : {report:reportData},
            url : url + 'report'
        })
    };
    //问题收藏 应用场景:1.问题详情-收藏(传参 questionId)
    this.collect = function(questionId){
        return $http({
            method : 'POST',
            data : {questionId: questionId},
            url : url + 'collect'
        })
    };

    //提高悬赏 应用场景:1.问题详情-提高悬赏(传参 questionId, newNum)
    this.addGold = function(coinQueryInput){
        return $http({
            method : 'POST',
            params : coinQueryInput,
            url : url + 'addGold'
        });
    };

    //取消提问 应用场景:1.问题详情-取消提问(传参 questionId)
    this.cancel = function(questionId){
        return $http({
            method : 'POST',
            data:{questionId: questionId},
            url : url + 'cancel'
        });
    };

    //分页获取问题的答案列表 应用场景:1.问题详情-答案列表(传参 questionBid, limit, page)
    this.listAnswers = function(answerQueryInput){
        return $http.post(url + 'listAnswers', answerQueryInput);
    }

    //采纳回答 应用场景:1.回答详情-采纳(传参 answerId, content)
    this.adoptAnswer = function(answerId, content){
        return $http({
            method : 'POST',
            data : {answerId: answerId, content: content},
            url : url + 'answer/bid'
        })
    };

    //根据答案bid获取答案详情 应用场景:1.问题详情-答案详情
    this.getAnswer = function(answerDetailInput){
        return $http({
            method : 'GET',
            params:answerDetailInput,
            url : url + 'getAnswer'
        });
    };

    //回答问题 应用场景:1.我要回答-输入内容-回车(传参 questionBid, content=[{content,type}])
    this.answer = function(answerContentModel){
        return $http({
            method : 'POST',
            data:answerContentModel,
            url : url + 'answer'
        })
    };

    //发布问题(传参 coin, userBid, subject, contents={content,type})
    this.publish = function(questionDetailModel){
        return $http({
            method : 'POST',
            data:questionDetailModel,
            url : url + 'publish'
        })
    }

    //获取问题的推送用户量 应用场景:1.发布问题后-推送页面(传参 questionId)
    this.getPushNum = function(questionId){
        return $http({
            method : 'GET',
            params:{questionId: questionId},
            url : url + 'pushNum',
            json: true
        });
    };

    //本地数据库添加问题记录(传参{question各个字段, contents: questionContents})
    this.addLocalQuestion = function(question){
        var questionSql = {
            "table" : "Question",
            "cols" : ['bid','subject','way','coin','finishAnswer','dataStatus','createUser','createTime','updateUser','updateTime'],
            "vals" : [question.bid,question.subject,question.way,question.coin,question.finishAnswer,question.dataStatus,question.createUser,question.createTime,question.updateUser,question.updateTime]
        };
        //ProblemDao.addQuestion(questionSql, question.bid);

        var contents = question.contents;
        angular.forEach(contents, function(qc, key) {
            if(qc.content != null && qc.content.trim().length > 0){
                var questionContentSql = {
                    "table" : "QuestionContent",
                    "cols" : ['bid', 'questionBid', 'type', 'content','dataStatus','createUser','createTime','updateUser','updateTime'],
                    "vals" : [qc.bid,qc.questionBid,qc.type,qc.content,qc.dataStatus,qc.createUser,qc.createTime,qc.updateUser,qc.updateTime]
                };
                //ProblemDao.addQuestionContent(questionContentSql,qc.bid);
            }
        });
    }

    // 获取本地question, 回调callback(question查询到的question数据)
    this.findLocalQuestion = function(questionBid, callback) {
        var sqlJson = {
            "table" : "Question",
            "cols" : ['bid', 'coin', 'finishAnswer', 'createUser', 'createTime'],
            "condition" : [{
                'key' : 'bid',
                'value' : questionBid,
                'logic' : 'EQ'
            }, {
                'key' : 'dataStatus',
                'value' : '0',
                'logic' : 'GT'
            }],
            "limit" : [0, 1],
            "reverse" : false
        };
        //var status = ProblemDao.findQuestionList(sqlJson);
        status.then(function(result){
            if(result && result.length > 0){
                callback(result[0]);;
            }else{
                callback();
            }
        });
    }

    // 获取问题内容列表, 回调callback(questionContents)
    this.findLocalQuestionContents = function(questionBid, callback){
        var sqlJson = {
            "table" : "QuestionContent",
            "cols" : ['bid', 'type', 'content'],
            "condition" : [{
                'key' : 'questionBid',
                'value' : questionBid,
                'logic' : 'EQ'
            }, {
                'key' : 'dataStatus',
                'value' : '0',
                'logic' : 'GT'
            }],
            "reverse" : false
        };
        //var status = ProblemDao.findQuestionList(sqlJson);
        status.then(function(questionContents){
            callback(questionContents);
        });
    }
});
