/**
 * Created by zhaoyang
 */

var page=angular.module('user-setting', ['commonDirect','storage','ngDialog','directives']);
    page.controller('UserSettingController', function($scope,$rootScope, $http,Common,Store,ngDialog) {

        $rootScope.user={};
        $scope.hide=true;
        $rootScope.loginType="wx";
        //设置日历图片
        $scope.arrows = {
            year: {
                left: 'img/left.png',
                right: 'img/right.png'
            },
            month: {
                left: 'img/left.png',
                right: 'img/right.png'
            }
        }

        //读取用户信息
        $scope.initUserInfo=function() {
            $http.get(Common.baseURL+'/user/userInfo')
                .success(function (data, status) {
                    if(data.rescode!=0){
                        alert(data.resmsg);
                        return;
                    }
                    $scope.user=data.user;
                    $scope.user.showName=$scope.user.nickname;
                    $rootScope.schoolName=$scope.user.school.name;
                    if($scope.user.headPic.type=='wxPic'){
                        $scope.downLoadImgUrl=$scope.user.headPic.key;
                    }else{
                        $scope.downLoadImgUrl=Common.downLoadBaseURL+$scope.user.headPic.key;
                    }
                });
        }
        //初始化用户信息
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
                    $scope.user.class.name=$scope.grade+$scope.class+"班";
                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            });
            obj.hide({id: 0});
        }
        //初始化班级控件
        //$scope.chooseClass();
        //显示、隐藏班级控件
        $scope.changeDialog=function(){
            var obj = api.require('UICustomPicker');
            if($scope.hide){
                obj.show({id: 0});
                $scope.hide=false;
            }else{
                obj.hide({id: 0});
                $scope.hide=true;
            }
        }

        //选择学校
        $scope.selectSchool=function(isClose){
            if(isClose){
                if ($scope.closeThisDialog) $scope.closeThisDialog(0);
            }
            //var obj = api.require('UICustomPicker');
            //obj.hide({id: 0});
            //$scope.hide=true;
            ngDialog.open({
                template: 'chooseschool/chooseschool-info.tpl.html',
                controller: 'chooseschoolCtr'
            });
        }

        //选择性别
        $scope.changeGender=function(gender){
            $scope.user.gender=gender;
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        }

        //更新用户
        $scope.updateUser=function(){
            var json={}
            json.loginType='userInfo';
            json.nickName=$scope.user.nickname;
            json.school=$rootScope.schoolName;
            json.province=$rootScope.user.province?$rootScope.user.province:$scope.user.school.province;
            json.city=$rootScope.user.city?$rootScope.user.city:$scope.user.school.city;
            json.grade=$scope.grade;
            json.classNum=$scope.class;
            json.email=$scope.user.email;
            json.birthday=$scope.user.birthday;
            json.description=$scope.user.description;
            json.headPic=$rootScope.user.headPic?$rootScope.user.headPic:$scope.user.headPic._id;
            json.gender=$scope.user.gender;
            json.phone=$scope.user.phone;
            json.password=$scope.user.password;
            json.weixinId=$scope.user.weixinId;
            json.captcha=$scope.user.captcha;
            json.visible=$scope.visible;
            $http.post(Common.baseURL + "/user/updateUser", json).success(function(result) {
                if (result.rescode != 0 ) {
                    alert(result.resmsg);
                }else{
                    alert("更新用户信息成功!");
                    var obj = api.require('UICustomPicker');
                    obj.hide({id: 0});
                    $scope.hide=true;
                    if ($scope.closeThisDialog) $scope.closeThisDialog(0);
                    $rootScope.$broadcast('update.success');
                }
            });
        }

        //是否启用手机登录
        $scope.toggle = function () {
            $scope.visible = !$scope.visible;
        }

        //获取验证码
        $scope.validateNumber = function(){
            if (!$scope.user.phone) {
                alert("请输入有效的手机号");
                return;
            }
            $http.post(Common.baseURL + "/captcha/send", {phone:$scope.user.phone}).success(function(result) {});
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
    });
