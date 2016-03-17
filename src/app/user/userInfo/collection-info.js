
angular.module('myCollection', ['commonDirect', 'storage', 'ngDialog', 'problemService', 'tool'])
    .controller('myCollectionCtrl', function ($scope, $http, $rootScope, Store, Common, ngDialog, ProblemService, Tool, $sce) {
        var limit = 5;
        //底部刷新时间
        var bottomTime;
        $scope.downLoadBaseURL = Common.downLoadBaseURL;

        function initCollect(){
            ProblemService.myCollect({limit: limit}).success(function(data) {
                $scope.collectList = data.collects;
                bottomTime = data.collects[data.collects.length-1].collect.createTime;
                $scope.appendLength = data.collects.length;
                if($scope.appendLength === 0){
                    return;
                }
                for(var i=0;i <  $scope.collectList.length ; i++){
                    $scope.collectList[i].collect.createTime =Tool.getTimeDiff(new Date($scope.collectList[i].collect.createTime));
                }
            })
        }

        //底部加载
        $scope.wScrollToButtom = function() {
            ProblemService.myCollect({limit: limit, time: bottomTime}).success(function(data) {
                $scope.appendLength = data.collects.length;
                if($scope.appendLength === 0) {
                    return;
                }
                bottomTime = data.collects[data.collects.length-1].collect.createTime;
                //格式化问题收藏时间
                for(var i=0; i < data.collects.length ; i++) {
                     data.collects[i].collect.createTime =Tool.getTimeDiff(new Date(data.collects[i].collect.createTime));
                }
                $scope.collectList = $scope.collectList.concat(data.collects);
            })
        };

        //打开回答详情dialog方法 （参数/1.questionId 问题id/2.answerId 回答id）
        $scope.openDialog = function(template, ctrl, questionId, answerId) {
            ngDialog.open({
                template: template,
                controller: ctrl,
                data:{questionId: questionId,answerId: answerId}
            })
        };

        //音频播放
        $scope.playAudio = function (path) {
            var obj = api.require('audio');
            obj.play({
                path: path
            },function(ret,err){
                var duration = ret.duration;
                var current = ret.current;
            });
        };

        //视频播放
        $scope.playVideo = function(path) {
            api.openVideo({
                url: path
            });
        };

        //文字和表情string转成html
        $scope.toHtml = function(text) {
            return $sce.trustAsHtml(text);
        };

        $scope.stateReady(function() {
            initCollect();
        })
    });