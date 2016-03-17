/**
 * Created by zhaoyang
 */
var page = angular.module('myFeedback', ['commonDirect', 'storage', 'ngDialog','connectionAction']);
page.controller('myFeedbackCtrl', function ($scope, $http, $rootScope, Store, Common, ngDialog) {
    $scope.conWait=false;
    //图片地址,以及存在依据
    $scope.myimg0 = "./img/feedback/pic-02-m.png";
    $scope.myimgBool0 = false;
    $scope.myimg1 = "./img/feedback/pic-01-m.png";
    $scope.myimgBool1 = false;
    //请求返回的反馈对象
    $scope.allFeedBackList = [];
    //获取页面的数据(新工程修改了验证方式)
    $scope.httptest = function () {
        $scope.conWait=true;
        $http({
                method: 'POST',
                url: Common.baseURL + '/feedback/feedbackto'
            }
        ).success(function (data, status, headers, config) {
                $scope.conWait=false;
                $scope.conAction=false;
                $scope.allFeedBackList = data;
                if (data.length <= 0 || data == undefined) {
                    $scope.myimgBool0 = true;
                    $scope.myimgBool1 = false;
                } else {
                    $scope.myimgBool0 = false;
                    $scope.myimgBool1 = true;
                }
            }).error(function (data, status, headers, config) {
                $scope.conWait=false;
                alert("网络不给力~~连接失败了..╥﹏╥..");
                $scope.conAction=true;
            });
    };
    //初次刷新
    $scope.httptest();

    //每列信息点击
    $scope.listclick = function (feedinfo) {
        $scope.feedbackTalkUse=feedinfo;
        ngDialog.open({
            template: "feedback/feedback-talk.tpl.html",
            controller: "feedbacktalkCtr",
            scope: $scope
        });
    };

    ////添加方法到apiready的公共方法中
    //$scope.stateReady(function () {
    //    $scope.mRefresh();
    //});
});

//时间过滤器
page.filter("CTime", function () {
    return function (input) {
        var date = new Date();
        date.setFullYear(input.substring(0, 4));
        date.setMonth(input.substring(5, 7) - 1);
        date.setDate(input.substring(8, 10));
        date.setHours(input.substring(11, 13));
        date.setMinutes(input.substring(14, 16));
        date.setSeconds(input.substring(17, 19));

        var endTime;
        //当前时间戳
        var nowdate = new Date();
        nowdate = nowdate.getTime();
        //数据库时间戳
        var getdate = Date.parse(date) / 1000;
        nowdate = parseInt(nowdate / 1000);
        //相差时间
        var changedate = nowdate - getdate;
        //alert(getdate +"|"+nowdate+"="+changedate);
        if (changedate / 60 < 60) {
            endTime = parseInt(changedate / 60);
            endTime = endTime + "分钟前"
        } else if (changedate / 60 > 60 && changedate / 3600 < 24) {
            endTime = parseInt(changedate / 3600);
            endTime = endTime + "小时前"
        } else if (changedate / 3600 > 24 && changedate / 3600 < 168) {
            endTime = parseInt(changedate / 3600 / 24);
            endTime = endTime + "天前"
        } else if (changedate / 3600 / 24 / 7 > 1 && changedate / 3600 / 24 / 7 <= 4) {
            endTime = parseInt(changedate / 3600 / 24 / 7);
            endTime = endTime + "周前"
        } else if (changedate / 3600 / 24 / 7 > 4) {
            endTime = new Date(parseInt(getdate) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
        } else {
            endTime = "你的时间貌似不对,或许你穿越了!"
        }
        return endTime;
    }
});