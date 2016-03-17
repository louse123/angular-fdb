/**
 * Created by wangfan
 */
angular.module('myQuestion', ['commonDirect','ngDialog','service.mediaUpload'])
    .controller('myQuestionCtrl', function ($scope, $http,Common,ngDialog,MediaUploadService,$sce) {
        $scope.title="我的问题";
        $scope.limit = 6;
        $scope.time = null;
        $scope.resultList = [];
        $scope.downLoadBaseURL = Common.downLoadBaseURL;
        function initMyQuestion () {
            var json = {};
            json.time = $scope.time;
            json.limit = $scope.limit;
            $http({method : 'GET', params:json, url : Common.baseURL + "/question/myQuestion"})
                .success(function(result) {
                console.log(JSON.stringify(result));
                //console.log("userToken" + userToken);
                var len = result.questions.length;
                if(len > 0){
                    for(var i = 0; i<len; i++){
                        var time = Common.getDateDiff(Common.parse(result.questions[i].question.updateTime));
                        result.questions[i].updateTime = time;
                    }
                    $scope.time = result.questions[len -1].question.updateTime;
                    $scope.resultList = $scope.resultList.concat(result.questions);
                    if(len < $scope.limit){
                        $scope.showTip = true;
                    }
                }else{
                    $scope.showTip = true;
                }

            });
        }

        $scope.openDialog = function(template, controller, questionId){
            ngDialog.open({
                template:template,
                controller: controller,
                data:{questionId: questionId}
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

            }
            $scope.wScrollToButtom = function(){
                initMyQuestion();
            };
        }

        $scope.stateReady(function() {
            initMyQuestion();
            initEvents();
        });

    });