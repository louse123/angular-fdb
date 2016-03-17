/**
 * Created by zhaoyang
 */

var page=angular.module('settings', ['commonDirect','storage','ngDialog','directives']);
    page.controller('settingsController', function($scope,$rootScope, $http,Common,Store,ngDialog) {

        $scope.openDialog=function(template,controller){
            ngDialog.open({
                template: template,
                controller: controller
            });
        }

        $scope.loginOut = function() {
            api.confirm({
                title : '注销',
                msg : '此操作将清除所有缓存和登录信息,确认退出？',
                buttons : ['确定', '取消']
            }, function(ret, err) {
                if (ret.buttonIndex == 1) {
                    api.clearCache();
                    Store.removeStorage("user");
                    Store.removeStorage("OAUTH_TOKEN");
                    api.closeWidget({silent:true});
                }
            });

        }
    });
