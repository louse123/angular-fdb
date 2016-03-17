var page = angular.module("city", ['commonDirect','ngDialog']);
page.controller("cityCtrl", function($scope,$rootScope,$http,Common,ngDialog) {

    $scope.chooseCity=function(city){
        $rootScope.user.city=city;
        ngDialog.open({
            template: "school/area.tpl.html",
            controller: "areaCtrl"
        });
    }
});
