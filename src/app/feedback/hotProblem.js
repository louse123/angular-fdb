/**
 * Created by zhaoyang
 */
var page=angular.module('hotProblem', ['commonDirect','storage','ngDialog'])
    page.controller('hotProblemCtrl', function ($scope, $http, $rootScope,Store,Common,ngDialog) {

        $scope.Imok=function(){
            $scope.closeThisDialog();
        };
        $scope.goutofeedSub=function(url,controller){
            ngDialog.open({
                template: url,
                controller: controller
            })
        };
    });