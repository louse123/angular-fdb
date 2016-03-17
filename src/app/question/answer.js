var page = angular.module('question.answer', ['service.mediaUpload', 'problemService', 'commonDirect', 'directives.ac', 'tool', 'storage']);

page.controller('answerCtrl', function($scope,  $rootScope, Store, $http, ProblemService, Tool, MediaUploadService) {
    $scope.answerQ = true;
    if (!Store.getStorage('user') || Store.getStorage('user') == null) {
        $rootScope.$broadcast('auth:loginRequired');
    } else {
        var userId = Store.getStorage('user').user._id;
        var questionId = $scope.ngDialogData.questionId;
        //根据回答者的id和问题的id获取回答详情的数据
        ProblemService.getAnswer({userId: userId, questionId: questionId}).success(function(data){
            if(data.rescode === 0){
                $scope.qUser = data.answer.question.user._id;
                Store.getStorage('user').user._id === data.question.user? $scope.isQUser=true: $scope.isQUser=false;
                $scope.answerDetail = data.answer;
                $scope.questionCreateTime = Tool.formatDate($scope.answerDetail.question.updateTime);
                $scope.answerCreateTime = Tool.formatDate($scope.answerDetail.updateTime);
            }else if(data.rescode === 1){
                $scope.answerDetail = data.answer;
                $scope.questionCreateTime = Tool.formatDate($scope.answerDetail.question.updateTime);
            }
        });
    }

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
});