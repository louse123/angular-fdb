/**
 * Created by zhaoyang
 */
var page = angular.module("user.infoComplete", ['commonDirect','directives','ngDialog']);
page.controller("infoCompleteCtrl", function($scope,$rootScope,$http,Common,ngDialog) {

    $rootScope.user={};
    $scope.hide=true;
    $scope.visible = false;

    $scope.initUserInfo=function(){
        //如果是微信登录的情况
        if( $rootScope.loginType =='wx'){
            $http.get(Common.baseURL+'/user/userInfo')
                .success(function (data, status) {
                    if(data.rescode!=0){
                        alert(data.resmsg);
                        return;
                    }
                    $scope.wxUser=data.user;
                    $scope.nickName= $scope.wxUser.nickname;
                    $scope.downLoadImgUrl= $scope.wxUser.headPic.key;
                    $rootScope.user.headPic=$scope.wxUser.headPic._id;
                });
        }
    }

    $scope.initUserInfo();

    //选择班级控件
    $scope.chooseClass=function(){
        var obj = api.require('UICustomPicker');
        obj.open({
            rect : {
                x : 0,
                y : 500,
                w : 320,
                h : 250
            },
            styles : {
                bg : 'rgba(0,0,0,0)',
                normalColor : '#959595',
                selectedColor : '#3685dd',
                selectedSize : 36,
                tagColor : '#3685dd',
                tagSize : 10
            },
            data : [{
                tag : '年',
                scope : ['一年级','二年级','三年级','四年级','五年级','六年级','初一','初二','初三','高一','高二','高三','大一','大二','大三','大四']
            }, {
                tag : '班',
                scope : '1-50'
            }],
            rows : 5,
            fixedOn : '',
            fixed : true
        }, function(ret, err) {
            if (ret) {
                if(ret.data==undefined){return}
                $scope.grade=ret.data[0];
                $scope.class=ret.data[1];
                $scope.user.class=$scope.grade+$scope.class+"班";
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        });
        obj.hide({id: 0});
    }
    //$scope.chooseClass();
    //显示、隐藏班级控件
    $scope.changeDialog=function(){
        if($scope.hide){
            obj.show({id: 0});
            $scope.hide=false;
        }else{
            var obj = api.require('UICustomPicker');
            obj.hide({id: 0});
            $scope.hide=true;
        }
    }

    //是否启用手机登录
    $scope.toggle = function () {
        $scope.visible = !$scope.visible;
    }

    //获取验证码
    $scope.validateNumber = function(){
        if (!$scope.phoneNum) {
            alert("请输入有效的手机号");
            return;
        }
        var json = {};
        json.phone = $scope.phoneNum;
        $http.post(Common.baseURL + "/captcha/send", json).success(function(result) {
        });

        $scope.seconds = 0;
        var timer = setInterval(function(){
            $scope.seconds = $scope.seconds+1000;
            $scope.time = (30000-$scope.seconds)/1000;
            $scope.$digest();
            if($scope.time==0){
                $scope.seconds=0;
                $scope.time=null;
                clearInterval(timer)
            }
        },1000)
    }

    //跳过方法
    $scope.skip=function(){
        var dialog1 = $rootScope.dialogs[$rootScope.dialogs.length - 1];
        var dialog2 = $rootScope.dialogs[$rootScope.dialogs.length - 2];
        ngDialog.close(dialog1.attr('id'));
        ngDialog.close(dialog2.attr('id'));
    }

    //跳转选择学校
    $scope.selectSchool=function(isClose){
        $scope.hide=true;
        ngDialog.open({
            template: "school/province.tpl.html",
            controller: "provinceCtrl"
        });
    }

    //更新用户
    $scope.userUpdate=function(){
        var json = {};
        json.loginType=$rootScope.loginType;
        json.phone = $scope.phoneNum;
        json.password = $scope.password;
        json.captcha = $scope.validdata;
        json.nickName=$scope.nickName;
        json.school=$rootScope.user.school;
        json.province=$rootScope.user.province;
        json.city=$rootScope.user.city;
        json.grade= $scope.grade;
        json.classNum=$scope.class;
        json.headPic=$rootScope.user.headPic;
        json.visible=$scope.visible;
        $http.post(Common.baseURL + "/user/updateUser", json).success(function(result) {
            if (result.rescode != 0 ) {
                alert(result.resmsg);
            }else{
                alert("更新个人信息成功!");
                //var obj = api.require('UICustomPicker');
                //obj.hide({id: 0});
                $scope.hide=true;
                //跳过
                $scope.skip();
            }
        });
    }
});