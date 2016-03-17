var page = angular.module("area", ['commonDirect','ngDialog']);
page.controller("areaCtrl", function($scope,$rootScope,$http,Common,ngDialog) {

    $scope.chooseArea=function(){
        ngDialog.open({
            template: "school/school.tpl.html",
            controller: "schoolCtrl"
        });
    }
});
