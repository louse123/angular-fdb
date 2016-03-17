/**
 * Created by wangfan
 */
angular.module('myAnswer', ['commonDirect','ngDialog','service.mediaUpload'])
    .controller('myAnswerCtrl', function ($scope, $http,Common,ngDialog,MediaUploadService,$sce) {
        $scope.title="我的回答";
        $scope.limit = 6;
        $scope.time = null;
        $scope.resultList = [];
        $scope.downLoadBaseURL = Common.downLoadBaseURL;
        function initMyAnswer () {
            var json = {};
            json.time = $scope.time;
            json.limit = $scope.limit;
            $http({method : 'GET', params:json, url : Common.baseURL + "/question/myAnswers"})
                .success(function(result) {
                //console.log(JSON.stringify(result));
                var len = result.answers.length;
                if(len > 0){
                    $scope.time = result.answers[len -1].updateTime;
                    for(var i = 0; i<len; i++){
                        var time = Common.getDateDiff(Common.parse(result.answers[i].updateTime));
                        result.answers[i].updateTime = time;
                    }

                    $scope.resultList = $scope.resultList.concat(result.answers);
                    if(len < $scope.limit){
                        $scope.showTip = true;
                    }
                }else{
                    $scope.showTip = true;
                }

            });
        }

        $scope.openDialog = function(template, controller, userId, questionId){
            ngDialog.open({
                template:template,
                controller: controller,
                data:{userId: userId,
                    questionId: questionId}
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
        function initEvents(){
            $scope.wScrollToTop = function(){

            };
            $scope.wScrollToButtom = function(){
                //alert(123);
                initMyAnswer();
            };
        }

        $scope.stateReady(function() {
            initMyAnswer();
            initEvents();
        });
    });