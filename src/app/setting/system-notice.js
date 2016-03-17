/**
 * Created by zhaoyang
 */
angular.module('system-notice', ['commonDirect','storage','ngDialog'])
    .controller('systemNoticeCtrl', function ($scope, $http, $rootScope,Store,Common,ngDialog) {


        $scope.openDialog=function(template,controller){
            ngDialog.open({
                template: template,
                controller: controller
            });
        }
    });