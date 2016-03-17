var questionDetail = angular.module('question.detail', ['ngDialog', 'service.mediaUpload', 'problemService', 'commonDirect', 'directives.ac']);

questionDetail.controller('detailCtrl', function($rootScope, $scope, $sce, $http, MediaUploadService, ProblemService, Store, ngDialog, Common){
    $scope.downLoadBaseURL = Common.downLoadBaseURL;

    function getDetail(){
        ProblemService.getDetail($scope.ngDialogData.questionId).success(function(data){
            $scope.userInfo = data.askUser;
            $scope.question = data.question;
            $scope.answerList=[];
            $scope.continueAnswer = false;   //是否继续回答
            if(Store.getStorage('user') && Store.getStorage('user') != ""){
                Store.getStorage('user').user._id === data.question.user? $scope.isQUser=true: $scope.isQUser=false;
            }
            if(!data.answer || data.answer.length === 0){
                $scope.noAnswer = true;
                new Date().getTime() - new Date($scope.question.updateTime).getTime() > 1000*60*60*24?$scope.isOvertime = true:$scope.isOvertime = false;
                if(!$scope.isOvertime && $scope.isQUser){
                    ProblemService.getPushNum(data.question._id).success(function(res){
                        if(res.rescode === 0){
                            $scope.pushNum = res.pushNum;
                        }
                    })
                }
            }
            for(var i = 0;i<data.answer.length;i++){
                if(Store.getStorage('user') && Store.getStorage('user').user._id &&Store.getStorage('user').user._id == data.answer[i].user._id){
                    $scope.continueAnswer = true;
                    $scope.currentUserAnswerId = data.answer[i]._id;
                }
                if(data.answer[i].isBid === 1){ //是否中标
                    $scope.isBid = true;
                    $scope.trueAnswer = data.answer[i];
                    continue;
                }
                if(data.answer[i].isBid === 0){
                    $scope.answerList.push(data.answer[i]);
                }
            }
        });
    }

    $scope.openDialog = function(template, controller, questionId, answerId){
        ngDialog.open({
            template:template,
            controller: controller,
            data: {questionId: questionId, answerId: answerId}
        })
    };

    //若用户已登录,则可打开回答详情dialog进行回答，若没有则向下广播登录事件
    $scope.goReply = function(template, controller, questionId, answerId) {
        if(!Store.getStorage('user') || Store.getStorage('user') === ""){
            $rootScope.$broadcast('auth:loginRequired');
        }else{
            $scope.openDialog(template, controller, questionId, answerId)
        }
    };

    //增加悬赏金币
    $scope.addGold = function(inputQuery) {
        ProblemService.addGold(inputQuery).success(function (data) {
            if (data.rescode === 0) {
                alert("增加金币数成功！");
            } else {
                alert("增加金币数失败！")
            }
        })
    };

    //取消问题
    $scope.cancel = function(){
        ProblemService.cancel($scope.question._id).success(function(data){
            if(data.rescode === 0){
                alert('取消问题成功')
                $scope.question.dataStatus = 0;
            }else{
                alert('取消问题失败')
            }
        });
    };

    //举报问题
    $scope.report = function(){
        var reportData = {};
        reportData.source = $scope.question._id;
        reportData.type = 'QUESTION';
        reportData.content = $('input[name="reportContent"]:checked').val();
        ProblemService.report(reportData).success(function(data){
            if(data.rescode === 0){
                alert("举报成功！");
            }else if(data.rescode === 300003){
                alert("举报的问题不存在！")
            }
        })
    };

    //问题收藏
    $scope.collect = function(){
        ProblemService.collect($scope.question._id).success(function(data){
            if(data.rescode === 0){
                alert("已成功添加至收藏列表！")
            }
            if(data.rescode === 1){
                alert("你已经收藏过该问题了！")
            }
            else{
                alert("收藏失败，请再试一次！")
            }
        });
    };

    //回答采纳
    $scope.adopt = function(answer){
        var inputData = {};
        inputData.content={
            type: 'text',
            content: '<img src="img/question_detail/xq-m-well-.png" style="margin:3% 0 0 -15%"/><div style="margin-bottom: 0; margin-left: -1em;" class="pull-right">谢谢你的回答。<br/>完美解决了我的问题！<br/>赞赞的！<br/><span style="color: #a78452;font-size: 12px"><img style="margin-top: -3px" src="img/question_detail/xq-m-gold-.png" alt=""/> 获得' + $scope.answer.question.coin + '金币</span></div>',
            user: Store.getStorage('user').user._id
        };
        inputData.answerId = answer._id;
        answer.content.push(inputData.content);
        ProblemService.adoptAnswer(inputData).success(function(data){
            if(result.rescode === 0){
                alert('采纳成功！');
                data.answer.question.finishAnswer = 1;
            }else{
                alert('采纳失败！')
            }
        })
    };

    $scope.toHtml = function(text) {
        return $sce.trustAsHtml(text);
    };

    $scope.playAudio = function (path) {
        path = MediaUploadService.buildDownloadURL(path);
        // 播放网络音频则需要用audio模块
        var obj = api.require('audio');
        obj.play({
            path: path
        },function(ret,err){
            var duration = ret.duration;
            var current = ret.current;
        });
    };

    $scope.playVideo = function (path) {
        path = MediaUploadService.buildDownloadURL(path);
        api.openVideo({
            url: path
        });
    };

    $scope.stateReady(function(){
        getDetail();
    });
});