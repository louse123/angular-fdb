var page = angular.module("province", ['commonDirect','ngDialog']);
page.controller("provinceCtrl", function($scope,$rootScope,$http,Common,ngDialog) {


    $scope.chooseProvince=function(province){
        $rootScope.user.province=province;
        $rootScope.chooseSchoolType=0;
        ngDialog.open({
            template: "school/city.tpl.html",
            controller: "cityCtrl"
        });
    }

    $scope.myChoose=function(province,city){
        $rootScope.user.province=province;
        $rootScope.user.city=city;
        $rootScope.chooseSchoolType=1;
        ngDialog.open({
            template: "school/area.tpl.html",
            controller: "areaCtrl"
        });
    }
});
