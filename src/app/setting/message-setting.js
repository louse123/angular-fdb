/**
 * Created by zhaoyang
 */
var page=angular.module('message-setting', ['commonDirect','storage','ngDialog','directives']);
    page.controller('messageSettingCtrl', function ($scope, $http, $rootScope,Store,Common,ngDialog) {
        $scope.index=0
        $scope.array=new Array();

        //下拉刷新
        $scope.wScrollToButtom=function(){
            $scope.index=$scope.index+15;
            for(var i=$scope.array.length;i<$scope.index;i++){
                $scope.array[i]=i;
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        }
        //上拉加载
        $scope.wScrollToTop=function(){
            $scope.index=0
            $scope.array=new Array();
            $scope.wScrollToButtom();
        }

        $scope.wScrollToButtom();
    });