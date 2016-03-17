/**
 * Created by zhaoyang
 */
angular.module('feedback-info', ['commonDirect','storage','ngDialog'])
    .controller('feedbackInfoCtrl', function ($scope, $http, $rootScope,Store,Common,ngDialog) {
        // 初始化问题数据
        $scope.questions = [];
        $scope.questions.push({
            num: 1,
            name: "收到消息没有提示"
        });
        $scope.questions.push({
            num: 2,
            name: "设置/更改微信号"
        });
        $scope.questions.push({
            num: 3,
            name: "搜索不到附近的人"
        });
        $scope.questions.push({
            num: 4,
            name: "备份/恢复聊天记录"
        });
        $scope.questions.push({
            num: 5,
            name: "照片查看权限"
        });
        $scope.questions.push({
            num: 6,
            name: "聊天未读消息保留时间"
        });
        $scope.questions.push({
            num: 7,
            name: "设置更改微信账号"
        });

        //滑动速度
        $scope.speed = 300;

        //点击打开Dialog
        $scope.openDialog=function(template,controller){
            ngDialog.open({
                template: template,
                controller: controller
            });
        }
        //热门问题列表
        $scope.tomyhotquestion = function (num) {
            ngDialog.open({
                template:"feedback/hotProblem.tpl.html",
                controller: "hotProblemCtrl"
            });
        };

        //添加方法到apiready的公共方法中
        $scope.stateReady(function () {
            //$scope.backbutton();
            //$scope.backevn();
        });

    });