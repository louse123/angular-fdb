/**
 * Created by wangfan on 2015/8/27.
 */
var page = angular.module("rankList", ['commonDirect', 'directives.ac','service.mediaUpload']);
page.controller("RankListController", function($scope, Common, $http, MediaUploadService) {

    $scope.type = -1;//土豪榜

    $scope.change = function(type){
        $scope.type = type;
    }

    $scope.initRankList = function(){
        listRank(-1);
        listRank(1);
    }


    function listRank(type){
        $http({method:'GET', params:{type : type}, url : Common.baseURL + "/rank/goldRank"}).success(function(result){
            console.log(JSON.stringify(result));
            $.each(result.ranks, function(index, rank){
                if(rank.user != null && rank.user.headPic != null && rank.user.headPic.key != null
                    && rank.user.headPic.key.trim().length > 0){
                    rank.headPic =MediaUploadService.buildDownloadURL(rank.user.headPic);
                }
                if(rank.type == 1){
                    getHonor(rank, incomeHonors);
                }else{
                    getHonor(rank, richHonors);
                }
            });
            if(type == -1){
                $scope.richRankList1 = result.ranks;
                $scope.richRankList2 = $scope.richRankList1.slice(3);
                $scope.myRichRank = result.myRank;
            }else if(type == 1){
                $scope.inRankList1 = result.ranks;
                $scope.inRankList2 = $scope.inRankList1.slice(3);
                $scope.myInRank = result.myRank;
            }
        });
    }

    //获取头衔
    var richHonors = ['难民', '贫民', '铁公鸡', '小抠门', '平民', '小康', '小土豪', '土豪', '神豪', '财神爷'];
    var incomeHonors = ['挣扎在温饱线', '屌丝', '灰领', '蓝领', '白领', '粉领', '金领', '略有资产', '老板', '赚钱皇帝'];

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


    $scope.openWin = function(name, url, pageParam) {
        api.openWin({
            name : name,
            url : url,
            pageParam : pageParam
        });
    }

    $scope.functionList = new Array();
    $scope.functionList.push("initRankList");

    //$scope.$on('login.success', function() {
    //    $scope.initRankList();
    //});
    $scope.initRankList();
});