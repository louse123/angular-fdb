/**
 * Created by zhaoyang
 */
var page=angular.module('user.info', ['commonDirect','storage','ngDialog']);
    page.controller('MyUserInfoController', function($scope,$rootScope, $http,Common,Store,ngDialog) {

        //读取用户数据
        $scope.initUserInfo=function() {
            $http.get(Common.baseURL+'/user/userInfo')
                .success(function (data, status) {
                    if(data.rescode!=0){
                        alert(data.resmsg);
                        return;
                    }
                    $scope.user=data.user;
                    $scope.headImg=Common.downLoadBaseURL+$scope.user.headPic.key;
                });
        }
        //初始化用户数据
        $scope.initUserInfo();

        $rootScope.$on('update.success', function () {
            $scope.initUserInfo();
        });

        $scope.scrollAndRefresh = function() {
            //滚动分页
            if($scope.currentUser==$scope.loginUser){
                return;
            }
            api.addEventListener({
                name : 'scrolltobottom'
            }, function(ret, err) {
                api.showProgress({
                    title : '加载中...',
                    modal : false
                });
                $scope.pageNo = $scope.pageNo + 1;
                $scope.wonder4Answer();
                var timer = setTimeout("api.hideProgress()", 1000);
            });
        }

        $scope.wonder4Answer = function() {
            var json = {};
            json.answerBid = $scope.currentUser;
            json.pageNo = $scope.pageNo;
            json.pageSize = $scope.pageSize;
            $http.post(Common.baseURL + "/api/question/wonder4answer", json).success(function(result) {
                if ($scope.pageNo <= 1) {//第二页之后执行append操作
                    $scope.resultList = result;
                } else {
                    $scope.resultList = $scope.resultList.concat(result);
                }
                $scope.appendLength = result.length;
                if ($scope.appendLength == 0) {
                    $scope.tipText = "没有更多了"
                    return;
                }
            });
        }

        $scope.openDialog=function(template,controller){
            ngDialog.open({
                template: template,
                controller: controller
            });
        }
    });
