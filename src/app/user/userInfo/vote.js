angular.module("vote",['directives.ac', 'commonDirect', 'service.mediaUpload']).controller("voteCtrl", function($scope, $http, $interval, $sce, Common, MediaUploadService){
    $scope.userId = '';
    $scope.hasVote = false;
    $scope.monitorVoteId = '';
    $scope.data = {};
    $scope.hour = 0;
    $scope.minute = 0;
    $scope.second = 0;
    $scope.btnDisable = false;

    function init(){
        $scope.monitorVoteId = $scope.ngDialogData.monitorVoteId;
        var listUrl = Common.baseURL + '/class/vote/list' ;
        $http({
            method: 'GET',
            url: listUrl,
            params: {monitorVoteId: $scope.monitorVoteId}
        }).success(function(data){
            console.log(JSON.stringify(data));
            if(data.rescode == 0){
                $scope.data = data.data;
                if($scope.data.currentVoteUserId != null && $scope.data.currentVoteUserId.trim().length > 0){
                    $scope.hasVote = true;
                }

                if($scope.data.remainTime){
                    // 开始倒计时
                    $scope.hour = $scope.data.remainTime.hour;
                    $scope.minute = $scope.data.remainTime.minute;
                    $scope.second = $scope.data.remainTime.second;
                    var count = $interval(function(){
                        var second = $scope.second - 1;
                        if(second < 0){
                            if($scope.minute > 0 || $scope.hour > 0){
                                second=59;
                                var minute = $scope.minute - 1;
                                if(minute < 0 && $scope.hour > 0){
                                    minute = 59;
                                    $scope.hour = $scope.hour -1;
                                }
                                $scope.minute = minute;
                            }
                        }
                        $scope.second = second;

                        if($scope.hour == 0 && $scope.minute == 0 && $scope.second == 0){
                            $interval.cancel(count);
                        }
                    }, 1000);
                }
            }
        });
    }

    $scope.confirmVote = function(index, voteUserId){
        console.log('click vote');
        $scope.btnDisable = true;
        var voteUrl = Common.baseURL + '/class/voteRecord/add';
        $http({
            method : 'POST',
            url : voteUrl,
            data: {monitorVoteId: $scope.monitorVoteId, monitor: voteUserId}

        }).success(function(data){
            if(data.rescode == 0){
                $scope.data.votes[index].voteNum = $scope.data.votes[index].voteNum + 1;
                $scope.hasVote = true;
                $scope.data.currentVoteUserId = voteUserId;
            }else{
                $scope.btnDisable = false;
            }
        });
    };

    $scope.downLoadBaseURL = Common.downLoadBaseURL;

    $scope.stateReady(function() {
        init();
    });
});