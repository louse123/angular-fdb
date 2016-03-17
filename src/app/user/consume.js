/**
 * Created by zhaoyang
 */
angular.module('user.consume', ['commonDirect','storage','ngDialog'])
    .controller('consumeController', function ($scope, $http, $rootScope,Store,Common,ngDialog) {

        $scope.openDialog=function(template,controller){
            ngDialog.open({
                template: template,
                controller: controller
            });
        }
    });