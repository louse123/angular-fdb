var page = angular.module('question.answerDetail', ['problemService', 'pushService', 'tool', 'commonDirect', 'commonPopup', 'storage']);

page.controller('answerDetailCtrl', function($scope,$http,$sce,$timeout,ProblemService,Tool,Store,popup,PushService,Common){
    var answerId = $scope.ngDialogData.answerId;
    var questionId = $scope.ngDialogData.questionId;
    if(Store.getStorage('user') && Store.getStorage('user') != ""){
        var currentUserId = Store.getStorage('user').user._id;
    }
    $scope.downLoadBaseURL = Common.downLoadBaseURL;

    function initDetail(){
        var condition = {};
        answerId? condition.answerId = answerId: $scope.noAnswerId = true;
        if(questionId) condition.questionId = questionId;
        if(currentUserId) condition.userId = currentUserId;
        //根据回答者的id和问题id获取回答详情的数据
        ProblemService.getAnswer(condition).success(function(data){
            if(data.rescode === 0){
                $scope.qUser = data.answer.question.user._id;
                currentUserId === $scope.qUser? $scope.isQUser=true: $scope.isQUser=false;
                if(data.answer.content.length>0) currentUserId === data.answer.user._id? $scope.isAUser=true: $scope.isAUser=false;
                $scope.answerDetail = data.answer;
                $scope.questionCreateTime = Tool.formatDate($scope.answerDetail.question.updateTime);
                $scope.answerCreateTime = Tool.formatDate($scope.answerDetail.updateTime);
            }
        });
    }

    //显示贺图方法
    function adopt(){
        var html="<div class='question-adopt' style='width: "+ popup.w +"px;height: "+ popup.h +"px;position:absolute;z-index:666;left:0;top:0;background-color:rgba(249,249,249,.8);text-align: center;'>";
        html+="<img style='margin-top: 30%'src='img/0911-xh128.png' width='90%' height='50%'/></div>"
        $(".container").append(html);
        $timeout(function(){
            $('.question-adopt').remove();
        }, 6000);
    };

    function initEvent() {
        PushService.init();
        // 监听推送过来的对话消息
        PushService.addListener(function(msg) {
            var extra = msg.extra;
            if (extra.type === 'QUESTION_ANSWER' && extra.answerId === $scope.answerDetail._id) {
                $scope.answerDetail.content.push(extra.data);
                if (msg.extra.isBid) {//答案被采纳
                    // 显示贺图并于6秒后消失
                    adopt();
                }
            }
            $scope.$apply();
        });
    }

    //举报回答
    $scope.report = function(){
        var reportData = {};
        reportData.source = $scope.answerDetail._id;
        reportData.type = 'ANSWER';
        reportData.content = $('input[name="reportContent"]:checked').val();
        ProblemService.report(reportData).success(function(data){
            $('.b-shade').remove();
            if(data.rescode === 0){
                alert('举报已提交！');
            }else if(data.rescode === 300003){
                alert('举报的答案不存在！');
            }
        })
    };

    //采纳回答
    $scope.bidAnswer = function(){
        var content = {
            type: 'text',
            content: '<img src="img/question_detail/xq-m-well-.png" style="margin:3% 0 0 -15%"/><div style="margin-bottom: 0; margin-left: -1em;" class="pull-right">谢谢你的回答。<br/>完美解决了我的问题！<br/>赞赞的！<br/><span style="color: #a78452;font-size: 12px"><img style="margin-top: -3px" src="img/question_detail/xq-m-gold-.png" alt=""/> 获得' + $scope.answerDetail.question.coin + '金币</span></div>',
            user: currentUserId
        };
        $scope.answerDetail.content.push(content);

        ProblemService.adoptAnswer( $scope.answerDetail._id, content).success(function(result){
            if(result.rescode === 0){
                $scope.answerDetail.question.finishAnswer = 1;
                alert("采纳成功！");
            }else{
                alert("采纳失败！");
            }
        })
    };

    function saveAnswer(data){
        var condition = {
            questionId : $scope.answerDetail.question._id,
            content : data
        };
        if($scope.answerDetail._id){
            condition.answerId = $scope.answerDetail._id;
        }
        ProblemService.answer(condition).success(function(result) {
            if (!$scope.answerDetail._id) {
                $scope.answerDetail._id = result.answer._id;
                $scope.answerDetail.user = result.answer.user;
            }
        });
    };

    $scope.pushChatData = function(data) {
        if (data != '' && $.trim(data.content).length > 0) {
            // 当前用户
            data.user = Store.getStorage('user').user._id;
            $scope.answerDetail.content.push(data);
            if (data.type === 'pic' || data.type === 'audio' || data.type === 'video') {
                MediaUploadService.upload(data.content, data.type, function(err, ret) {
                    if (err) {
                        console.log('PushDataERR: ' + err);
                    } else {
                        console.log('PushData: ' + JSON.stringify(ret));
                        data.file = ret.key;
                        saveAnswer(data);
                    }
                });
            } else {
                saveAnswer(data);
            }
        }
    };

    $scope.playAudio = function (path) {
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
        api.openVideo({
            url: path
        });
    };

    $scope.toHtml = function(text) {
        return $sce.trustAsHtml(text);
    };

    $scope.stateReady(function(){
        initEvent();
        initDetail();
    });
});

