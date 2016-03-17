var page = angular.module("questionList", ['commonDirect', 'pushService', 'problemService', 'storage','tool', 'ngDialog']);

page.controller('questionListController', function($rootScope, $sce, $scope, PushService, ProblemService, Store, Common, Tool,ngDialog){

    // 顶部刷新的时间点, 底部加载的时间点
    var topTime, bottomTime;
    var limit = 5;
    var subject;
    $scope.downLoadBaseURL = Common.downLoadBaseURL;
    $scope.guideList = [];
    $scope.formatTime = [];
    //数据初始化
    function init() {
        //从服务器获取科目列表
        ProblemService.listSubject().success(function(list) {
            if(list.rescode == 0){
                list.subjects.unshift('全部');
                $scope.subjects =  list.subjects;
                $scope.changeSearch( $scope.subjects[0]);
            }
        })
    };

     function initEvents(){
         //滚动条下拉刷新
         $scope.scrollToButtom = function() {
            $('#pullUp').fadeIn();
             ProblemService.listByPage({time: bottomTime, subject: subject , timeOperate: 'lt', limit: limit}).success(function(data) {
                 if(data.rescode === 0){
                     $('#pullUp').fadeOut();
                     $scope.appendLength = data.questions.length;
                     if(data.questions.length === 0){
                         $scope.tipText = "没有更多了";
                         return;
                     }
                     bottomTime = data.questions[data.questions.length - 1].question.updateTime;
                     //格式化时间
                     for(var i=0; i<data.questions.length; i++){
                         data.questions[i].question.updateTime = Tool.getTimeDiff(new Date(data.questions[i].question.updateTime));
                     }
                     $scope.guideList=$scope.guideList.concat(data.questions);
                 }
             });
         };

         //顶部刷新
         $scope.scrollToTop = function() {
             $("#pullDown").fadeIn('slow',function() {
                $(this).addClass('loading');
                 ProblemService.listByPage({time: topTime, subject: subject, timeOperate: 'gt', limit:limit}).success(function(data) {
                     if(data.rescode === 0 && data.questions.length > 0){
                         topTime = data.questions[0].question.updateTime;
                         //格式化时间
                         for(var i=0; i<data.questions.length; i++){
                            data.questions[i].question.updateTime = Tool.getTimeDiff(new Date(data.questions[i].question.updateTime));
                         }
                         $scope.guideList=data.questions.concat($scope.guideList);
                     }
                     $(this).removeClass('loading');
                     $("#pullDown").fadeOut('slow');
                 });
             });
         };
    }

    //根据学科加载对应数据
    $scope.changeSearch = function(search) {
        $("html,body").animate({scrollTop:"0px"},200);
        $scope.search = search;
        subject = search;
        if(search === "全部") subject = "";
        ProblemService.listByPage({limit: limit, subject:subject}).success(function(data){
            $scope.appendLength = data.questions.length;
            if(data.questions.length === 0){
                $scope.tipText = "没有更多了";
                return;
            }
            topTime =data.questions[0].question.updateTime;
            bottomTime = data.questions[data.questions.length - 1].question.updateTime;
            //格式化时间
            for(var i=0; i<data.questions.length; i++){
                    data.questions[i].question.updateTime = Tool.getTimeDiff(new Date(data.questions[i].question.updateTime));
            }
            $scope.guideList = data.questions;
        });
    };

    //文字和表情string转成html
    $scope.toHtml = function(text) {
        return $sce.trustAsHtml(text);
    };

    //音频播放方法
    $scope.playAudio = function (path) {
        var obj = api.require('audio');
        obj.play({
            path: path
        },function(ret,err){
            var duration = ret.duration;
            var current = ret.current;
        });
    };

    //视频播放方法
    $scope.playVideo = function (path) {
        api.openVideo({
            url: path
        });
    };

    //打开回答详情dialog方法 （参数/1.questionId 问题id/2.answerId 回答id）
    $scope.openDialog = function(template, controller, questionId, answerId) {
        ngDialog.open({
            template:template,
            controller: controller,
            data:{questionId: questionId, answerId: answerId}
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

    $scope.stateReady(function() {
       init();
       initEvents();
    });
});

