/**
 * Created by Administrator on 2015/8/7.
 */
angular.module('app', [
    'ngRoute',
    'ngTouch',
    'ngDialog',
    'angular-iscroll',
    'materialDatePicker',
    'directives',
    'security',
    'templates.common',
    'templates.app',
    'app.user',
    'app.school',
    'app.question',
    'app.message',
    'app.mission',
    'app.userInfo',
    'app.setting',
    'app.feedback',
    'app.coffers',
    "app.drawmoney",
    "app.chooseschool",
    'app.shopping'
]).config(['ngDialogProvider',
    // 配置ngDialog默认属性
    function (ngDialogProvider) {
        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-plain b-window',
            plain: false,
            showClose: false,
            closeByDocument: false,
            closeByEscape: false
        });
    }]).config(['$routeProvider',
    // 配置路由规则
    function ($routeProvider) {
        $routeProvider
            .when('/question', {
                url: '/question',
                templateUrl: 'question/list.tpl.html',
                controller: 'questionListController'
            })
            .when('/mission', {
                url: '/mission',
                templateUrl: 'mission/mission-info.tpl.html',
                controller: 'missionInfoCtrl'
            })
            .when('/message', {
                url: '/message',
                templateUrl: 'message/message-info.tpl.html',
                controller: 'messageInfoController'
            })
            .when('/user', {
                url: '/user',
                templateUrl: 'user/user-info.tpl.html',
                controller: 'MyUserInfoController'
            })
            .otherwise('/question');
    }]).config(['$httpProvider', function ($httpProvider) {
    // 创建请求和响应拦截器
    var interceptor = function ($q, $rootScope, SecurityService) {
        return {
            request: function (config) {
                if (SecurityService.authed()) {
                    if (!config.headers) config.headers = {};
                    config.headers.Authorization = SecurityService.getUserToken();
                }
                return config;
            },
            requestError: function (rejection) {
                return $q.reject(rejection);
            },
            response: function (response) {
                return response;
            },
            responseError: function (rejection) {
                switch (rejection.status) {
                    case 401:
                    case 403:
                        if (!/oauth\/token/.test(rejection.config.url)) {
                            $rootScope.$broadcast('auth:loginRequired');
                        }
                        break;
                    case 404:
                        $rootScope.$broadcast('page:notFound');
                        break;
                    case 500:
                        $rootScope.$broadcast('server:error');
                        break;
                }
                return $q.reject(rejection);
            }
        };
    };
    $httpProvider.interceptors.push(interceptor);
}]).controller('AppCtrl', function ($scope, $rootScope, $timeout, $location, ngDialog,MessageDao) {
    $scope.$on('$viewContentLoaded', function () {
        $scope.selectedMenu = $location.url().substr(1);
        if ($scope.scrInstance) {
            $scope.scrInstance.refresh();
        }
        $timeout(function () {
            if ($scope.scrInstance) {
                $scope.scrInstance.refresh();
            }
        }, 500);
    });
    $scope.$on('auth:loginRequired', function () {
        ngDialog.open({
            template: 'user/login.tpl.html',
            controller: 'LoginController'
        });
    });
    // 打开一个新的对话框后在$rootScope中保留该实例，以备后续按后退键时关闭
    $rootScope.$on('ngDialog.opened', function (e, $dialog) {
        if (e == null || $dialog.length <= 0) return;
        if (!$rootScope.dialogs) $rootScope.dialogs = [];
        $rootScope.dialogs.push($dialog);
    });
    // 当对话框被关闭时，从$rootScope中删除对话框实例。
    // 小技巧：由于对话框特性，关闭的永远是最上面的，所以这里只需要删除最后一个实例即可。
    $rootScope.$on('ngDialog.closed', function (e, $dialog) {
        if (e == null || $dialog.length <= 0) return;
        if ($rootScope.dialogs && $rootScope.dialogs.length > 0) {
            $rootScope.dialogs.pop();
        }
    });
    // 统一处理apiready事件
    apiready = function () {
        $rootScope.apiready = true;
        $rootScope.$broadcast('apiready');
    };

    // 工具方法，可以确保callback方法中的api对象一定存在，解决apiready未生效时api对象不存在的问题
    $rootScope.stateReady = function (callback) {
        $rootScope.apiready ? callback() : $rootScope.$on('apiready', callback);
    };
    // 按后退键时，如果有窗口，则关闭最后打开的窗口，否则，不预处理，使用原有的后退机制
    $scope.stateReady(function () {
        api.addEventListener({
            name: 'keyback'
        }, function (ret, err) {
            if ($rootScope.dialogs && $rootScope.dialogs.length > 0) {
                var dialog = $rootScope.dialogs[$rootScope.dialogs.length - 1];
                ngDialog.close(dialog.attr('id'));
            } else {
                api.toLauncher();
            }
        });
        MessageDao.openDataBase(function(result) {
            if (result.status) {

            }else{
                alert("数据库初始化失败");
            }
        });
    });
}).controller('FooterController', function ($scope) {
    $scope.selectedMenu = 0;
    $('#f-container').unbind(); //解绑
    $scope.selectMenu = function (item) {
        $scope.selectedMenu = item;
        return true;
    }
});