/**
 * Created by zhaoyang
 */
angular.module('about', ['commonDirect','storage','ngDialog'])
    .controller('aboutCtrl', function ($scope, $http, $rootScope,Store,Common,ngDialog) {

        $scope.openDialog=function(template,controller){
            ngDialog.open({
                template: template,
                controller: controller
            });
        }
    });