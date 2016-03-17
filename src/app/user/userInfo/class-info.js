/**
 * Created by wangfan
 */
angular.module('myClass', ['commonDirect','storage','ngDialog','service.mediaUpload'])
    .controller('myClassCtrl', function ($scope, $http, $rootScope,Store,Common,ngDialog,MediaUploadService) {
        $scope.showMoreInText = '';
        $scope.showMoreOutText = '';
        $scope.type = '收入';
        var feeUrl = Common.baseURL + '/class/classFee/list';
        //获取头衔
        var richHonors = ['难民', '贫民', '铁公鸡', '小抠门', '平民', '小康', '小土豪', '土豪', '神豪', '财神爷'];
        $scope.inFees1 = [];
        $scope.inFees2 = [];
        $scope.outFees = [];
        bottomAmount = null;
        bottomIndex = 0;
        $scope.voteIsInProcess = false;
        $scope.isMonitor = false;
       function init (){
            // 获取我的班级
            //var userToken = Common.auth.getUserToken();
            var myClassUrl = Common.baseURL + '/class/myClass';
            $http({method : 'GET', url : myClassUrl}).success(function(data){
                console.log("data: " + JSON.stringify(data));
                if(data.rescode == 0){
                    $scope.cls = data.classModel[0];
                    $scope.isMonitor = data.isMonitor;
                    $scope.loginUserId = data.loginUserId;
                }
            });

            // 初始收入明细
            listFees('收入');
            // 初始化支出明细
            listFees('支出');

            // 获取正在进行的推举
            var voteUrl = Common.baseURL + '/class/vote/findInProcess';
            $http.get(voteUrl).success(function(data){
                if(data.rescode == 0){
                    if(data.monitorVote != null && data.monitorVote._id.trim().length > 0){
                        $scope.monitorVoteId = data.monitorVote._id;
                        $scope.voteIsInProcess = true;
                    }
                }
            });
        }

        // 底部加载更多
        function events (){
            $scope.wScrollToButtom = function(){
                if($scope.type == '收入'){
                    listFees($scope.type);
                }
            };
        }

        $scope.change=function(type){
            $scope.type = type;
        }

        function listFees(type){
            var ptype = 1, limit = 6;
            //var userToken = Common.auth.getUserToken();
            if(type == '支出'){
                ptype = -1;
            }
            // 获取支出明细
            $http({method : 'GET', params:{type: ptype, limit: limit, amount:bottomAmount}, url : feeUrl}).success(function(data){
                console.log("classFeesList: " + JSON.stringify(data));
                if(data.rescode == 0){
                    if(type == '收入'){
                        var len = data.classFees ? data.classFees.length : 0;
                        if(len == 0){
                            $scope.showMoreInText = '没有更多了';
                        }else{
                            $.each(data.classFees, function(index, fee){
                                if(fee.contributor.headPic != null && fee.contributor.headPic.key != null
                                    && fee.contributor.headPic.key.trim().length > 0){
                                    fee.headPic =MediaUploadService.buildDownloadURL(fee.contributor.headPic.key);
                                }
                                fee.index = bottomIndex + index+1;
                                getHonor(fee, richHonors);
                            });
                            $scope.inFees1 = $scope.inFees1.concat(data.classFees);
                            $scope.inFees2 = $scope.inFees1.slice(3);
                            console.log(JSON.stringify(data.classFees[len -1]));
                            bottomAmount = data.classFees[len -1].amount;
                            bottomIndex = data.classFees[len - 1].index;
                            console.log(bottomAmount);
                        }
                    }else if(type == '支出'){
                        $scope.outFees = $scope.outFees.concat(data.classFees);
                        //$scope.outFees2 = $scope.outFees1.slice(3);
                        if(data.classFees.length == 0){
                            $scope.showMoreOutText = '没有更多了';
                        }
                    }
                }
                //api.hideProgress();
            });
        }

        function getHonor(rank, honors){
            var amount = rank.amount;
            if(amount >= 0 && amount <= 400){
                rank['honor'] = honors[0];
            }else if(amount >= 401 && amount <= 800){
                rank['honor'] = honors[1];
            }else if(amount >= 801 && amount <= 2000){
                rank['honor'] = honors[2];
            }else if(amount >= 2001 && amount <= 4000){
                rank['honor'] = honors[3];
            }else if(amount >= 4001 && amount <= 7000){
                rank['honor'] = honors[4];
            }else if(amount >= 7001 && amount <= 14000){
                rank['honor'] = honors[5];
            }else if(amount >= 14001 && amount <= 32000){
                rank['honor'] = honors[6];
            }else if(amount >= 32001 && amount <= 60000){
                rank['honor'] = honors[7];
            }else if(amount >= 60001 && amount <= 10000){
                rank['honor'] = honors[8];
            }else if(amount >= 100000){
                rank['honor'] = honors[9];
            }
        }

        $scope.openWin=function(name, url, pageParam, reload){
            api.openWin({
                name: name,
                url: url,
                reload: reload,
                pageParam: pageParam
            });
        };

        $scope.openDialog = function(template, controller, params){
            ngDialog.open({
                template:template,
                controller: controller,
                data:params
            })
        };

        $scope.stateReady(function() {
            init();
            events();
        });

    });