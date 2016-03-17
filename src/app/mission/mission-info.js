var page = angular.module('mission-info', ['service.mediaUpload', 'problemService', 'commonDirect', 'directives.ac']);
page.controller('missionInfoCtrl', function ($rootScope, $scope, $http, Common, MediaUploadService, ProblemService, Store) {
//这里是任务列表的整体数组集合
    $scope.MissionListAll = [];

    //var token = Common.auth.getUserToken();
    $scope.httpurl = Common.baseURL + "/mission/getmission";
    //请求数据
    $scope.getmissionInfo = function () {
        $http({
            method: 'POST',
            url: $scope.httpurl
        }).success(function (data, status, headers, config) {
            $scope.MissionListAll = data;
        }).error(function (data, status, headers, config) {
            alert("网络不给力~~连接失败了..╥﹏╥.." + data);
        });
    };
    $scope.getmissionInfo();
    /**
     * 这里是前端的js操作
     */
    $scope.gotoMission = function (murl) {
        alert(murl);
    };
    $scope.clickdown = function () {
        $scope.downUp = !$scope.downUp;
    };
    $scope.isActive = false;
    $scope.downupClick = function (id) {
        if ($scope.isActive) {
            $scope.clickput(id);
            $scope.isActive = false;
        } else {
            $scope.clickget(id);
            $scope.isActive = true;
        }
    }
    $scope.clickput = function (id) {
        $("#" + id + "d").show();
        $("#" + id + "a").removeClass().addClass("taskList_lingheight taskList_symbolSize glyphicon glyphicon-chevron-down");
        $("#" + id + "c").hide(300);
    };
    $scope.clickget = function (id) {
        $("#" + id + "d").hide();
        $("#" + id + "a").removeClass().addClass("taskList_lingheight taskList_symbolSize glyphicon glyphicon-chevron-up");
        $("#" + id + "c").show(300);
    };

    $scope.getAward = function (usermissionId) {
        //		alert(usermissionId);
        $scope.getAwardurl = Common.baseURL + "/mission/getmissionAward";
        $http({
            method: 'POST',
            url: $scope.getAwardurl,
            data: {
                "usermissionId": usermissionId
            }
        }).success(function (data, status, headers, config) {
            for (var i = 0; i < $scope.MissionListAll.length; i++) {
                for (var t = 0; t < $scope.MissionListAll[i].length; t++) {
                    if (usermissionId == $scope.MissionListAll[i][t].usermission._id) {
                        $scope.MissionListAll[i][t].usermission.status = 3;
                    }
                }
            }
        }).error(function (data, status, headers, config) {
            alert("网络不给力~~连接失败了..╥﹏╥.." + data);
        });
    }
});