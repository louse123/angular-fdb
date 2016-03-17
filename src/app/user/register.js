/**
 * Created by zhaoyang
 */
var page = angular.module("user.register", ['commonDirect','ngDialog','security']);
page.controller("registerCtrl", function($scope,$rootScope,$http,Common,ngDialog,SecurityService) {
    $scope.user = {};
    $scope.user.phoneNumber = '';
    $scope.user.inviteNumber = '';
    $scope.second = 0;

    //注册方法
    $scope.register = function() {
        var json = {};
        json.phone = $scope.user.phoneNumber;
        json.password = $scope.user.password;
        json.captcha = $scope.user.captcha;
        json.inviteNumber = $scope.user.inviteNumber;
        $http.post(Common.baseURL + "/user/register", json).success(function(result) {
            if (result.rescode != 0 &&result.rescode != 500000) {
                alert(result.resmsg);
                return;
            }
            var login = {};
            login.username = $scope.user.phoneNumber;
            login.password =  $scope.user.password;
            login.grant_type = "password";
            login.client_id = Common.auth.client.id;
            login.client_secret =Common.auth.client.sk;
            $http.post(Common.baseURL + "/oauth/token", login).success(function(token) {
                SecurityService.setToken(token);
                if(result.rescode==0)alert("恭喜注册成功,亲填写的邀请码不存在哦");
                if(result.rescode==500000)alert("恭喜注册成功,邀请码填写正确，10金币已经发放到你的金库");
                if ($scope.closeThisDialog) $scope.closeThisDialog(0);
                $rootScope.loginType='register';
                ngDialog.open({
                    template: 'user/user-complete.tpl.html',
                    controller: 'infoCompleteCtrl'
                });
            })
        });
    }

    //获取验证码
    $scope.getCaptcha = function() {
        if (!$scope.user.phoneNumber) {
            alert("请输入有效的手机号");
            return;
        }
        var json = {};
        json.phone = $scope.user.phoneNumber;
        $http.post(Common.baseURL + "/captcha/send", json).success(function(result) {});
        var abc = setInterval(function() {
            $scope.second = $scope.second + 1000;
            $scope.times = (60000 - $scope.second) / 1000;
            $scope.$digest();
            if ($scope.times == 0) {
                $scope.second = 0;
                $scope.times = null;
                clearInterval(abc);
            }
        }, 1000);
    }
});