/**
 * Created by a on 2015/9/25.
 */
var shoppingInfo = angular.module('shoppingInfo', ['commonDirect', 'ngDialog', 'myschoolAddr', 'storage']);
shoppingInfo.controller('shoppingInfoCtr', function ($scope, $http, $rootScope, Common, ngDialog, myschoolAddrlfac, Store) {
    //用户头像
    $scope.userImgUrl = Common.downLoadBaseURL + "" + Store.getStorage('user').user.headPic.key;
    //用户名称
    $scope.username = Store.getStorage('user').user.name;
    //等级制度遍历
    $scope.levelList = [{}, {}, {}, {}, {}, {}, {}, {}];
    $scope.myLevelListWidth = $scope.levelList.length * 92 + 30;
    $scope.myLevelListWidth = $scope.myLevelListWidth + "px";
    $scope.shoppingExpStyle = "width: " + $scope.myLevelListWidth + ";height: 40px;";
    chooseLeve(3);
    function chooseLeve(num) {
        //num为当前等级
        for (var i = 0; i < $scope.levelList.length; i++) {
            if ((num - 1) > i) {
                $scope.levelList[i]["expChoose"] = "1";
            } else if ((num - 1) == i) {
                $scope.levelList[i]["expChoose"] = "3";
                //经验数据(当前经验)
                $scope.mynowExp = 50;
                //经验数据(升级经验)
                $scope.myleveExp = 75;
                //经验比例
                $scope.mynowLeveExp = ($scope.mynowExp / $scope.myleveExp) * 100;
                $scope.levelList[i]["nowExp"] = "width: " + $scope.mynowLeveExp + "%;background-color: red"
            } else {
                $scope.levelList[i]["expChoose"] = "0"
            }
            console.log($scope.levelList[i]["expChoose"])
        }
    }

    //卡片下拉滚动
    $scope.shoppingStyle1 = 'position: absolute;width: 100%;height: 13%;top: 0px;background-color:white;z-index:2; transform: rotateZ(0);';
    $scope.shoppingStyle2 = 'position: absolute;width: 100%;height: 13%;bottom: 0px;background-color:#E4E4E4;z-index:2; transform: rotateZ(180deg);border-bottom-left-radius:20px;border-bottom-right-radius:20px;';
    $scope.shoppingStyle = $scope.shoppingStyle1;
    $scope.cardlist = [{}, {}, {}, {}, {}, {}, {}, {}];
    $scope.donwChoose = 0;
    $scope.shoppingDown = function () {
        if ($scope.donwChoose == 0) {
            $("#shoppingCardContent").hide();
            $scope.shoppingStyle = $scope.shoppingStyle2;
            $scope.donwChoose = 1;
            $("#shoppingCardList").fadeIn(500);
        } else if ($scope.donwChoose == 1) {
            $scope.shoppingStyle = $scope.shoppingStyle1;
            $("#shoppingCardList").hide();
            $("#shoppingCardContent").fadeIn(500);
            $scope.donwChoose = 0;
        }

    };
    $scope.cardClick = function (index) {
        $("#shoppingCardContent").hide();
        $scope.shoppingStyle = $scope.shoppingStyle2;
        $scope.donwChoose = 1;
        $("#shoppingCardList").fadeIn(500);
        setTimeout(function(){
            //document.getElementById(id).scrollIntoView();
            $('#shoppingCardList').scrollTop(285*index);
        },600)
    }
});