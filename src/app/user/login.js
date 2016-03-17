/**
 * Created by zhaoyang
 */
angular.module('user.login', ['commonDirect', 'storage', 'ngDialog', 'security','messageDao','pushService'])
    .controller('LoginController', function ($scope, $http, $rootScope, Store, Common, ngDialog, SecurityService,MessageDao,PushService) {
        //登录
        $scope.login = function () {
            var userData = {
                username: $scope.phone,
                password: $scope.password,
                grant_type: 'password',
                client_id: SecurityService.client.id,
                client_secret: SecurityService.client.sk
            };
            //获取token
            $http.post(Common.baseURL + "/oauth/token", userData).success(function (token) {
                SecurityService.setToken(token);
                //用token得到用户信息
                $http.get(Common.baseURL + '/user/userInfo').success(function (result) {
                    if (result == null || result.rescode != 0) {
                        console.log("登录失败，错误代码" + result.code + "获取用户信息失败");
                        return;
                    }
                    //保存用户信息
                    Store.setStorage("user", result);
                    if ($scope.closeThisDialog) $scope.closeThisDialog(0);
                    //初始化推送监听
                    PushService.init();
                    //创建监听
                    PushService.addListener();
                });
            }).error(function (err) {
                console.log("登录异常或用户名/密码错误" + err);
            });
        };

        //跳转微信登录
        $scope.openWeChat = function () {
            var wx = api.require('wx');
            wx.isInstalled(function(ret, err){
                if(ret.installed){
                    wx.auth({
                        apiKey: ''
                    }, function(ret, err){
                        if(ret.status){
                            wx.getToken({
                                apiKey: '',
                                apiSecret: '',
                                code: ret.code
                            },function(ret, err){
                                if(ret.status){
                                    $scope.refreshToken=ret.dynamicToken;
                                    $scope.accessToken=ret.accessToken
                                    wx.getUserInfo({
                                        accessToken: ret.accessToken,
                                        openId: ret.openId
                                    }, function(ret,err){
                                        if(ret.status){
                                            var user=ret;
                                            user.clientId=SecurityService.client.id;
                                            user.accessToken= $scope.accessToken;
                                            user.refreshToken =$scope.refreshToken;
                                            $scope.weChatLogin(user);
                                        }else{
                                            alert(err.code);
                                            if(err.code==1){
                                                wx.refreshToken({
                                                    apiKey: '',
                                                    dynamicToken: $scope.refreshToken
                                                },function(ret,err){
                                                    if(ret.status){
                                                        wx.getUserInfo({
                                                            accessToken: ret.accessToken,
                                                            openId: ret.openId
                                                        }, function(ret,err){
                                                            if(ret.status){
                                                                var user=ret;
                                                                user.clientId=SecurityService.client.id;
                                                                user.accessToken= $scope.accessToken;
                                                                user.refreshToken =$scope.refreshToken;
                                                                $scope.weChatLogin(user);
                                                            }else{
                                                                alert("获取用户信息失败,错误代码"+err.code);
                                                            }
                                                        });
                                                    }else{
                                                        alert("获取refreshToken失败,错误代码"+err.code);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }else{
                                    alert("获取accessToken失败,错误代码"+err.code);
                                }
                            });
                        }else{
                            alert("微信登陆认证失败,错误代码"+err.code);
                        }
                    });
                }else{
                    alert('当前设备未安装微信客户端');
                }
            });
        };

        $scope.weChatLogin=function(user){
            $http.post(Common.baseURL + "/user/wxRegister",user).success(function (result) {
                if(result.type=="register"){
                    $rootScope.loginType = "wx";
                    $rootScope.wxUser=user;
                    ngDialog.open({
                        template: 'user/user-complete.tpl.html',
                        controller: 'infoCompleteCtrl'
                    });
                }
                if(result.type=="wxLogin"){
                    if ($scope.closeThisDialog) $scope.closeThisDialog(0);
                }
                SecurityService.setToken(result.token);
            }).error(function (err) {
                alert(JSON.stringify(err));
            });
        }

        //跳转注册
        $scope.register = function () {
            ngDialog.open({
                template: 'user/register.tpl.html',
                controller: 'registerCtrl'
            });
        }


    });