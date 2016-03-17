var taskList = angular.module('TaskList', ["commonDirect"]);
taskList.controller('tasklistA', function($scope, $http, Common) {
	//这里是任务列表的整体数组集合
	$scope.MissionListAll = [];

	//var token = Common.auth.getUserToken();
	$scope.httpurl = Common.baseURL +"/mission/getmission";
	//请求数据
	$scope.getmissionInfo = function() {
		$http({
			method : 'POST',
			url : $scope.httpurl
		}).success(function(data, status, headers, config) {
			$scope.MissionListAll = data;
		}).error(function(data, status, headers, config) {
			alert("网络不给力~~连接失败了..╥﹏╥.." + data);
		});
	};
	$scope.getmissionInfo();
	/**
	 * 这里是前端的js操作
	 */
	$scope.gotoMission = function(murl) {
		alert(murl);
	};
	$scope.clickdown = function() {
		$scope.downUp = !$scope.downUp;
	};
	$scope.isActive = true;
	$scope.clickput = function(id, id2, id3) {
		$("#" + id + "d").show();
		$("#" + id + "a").slideDown(300);
		$("#" + id + "b").slideUp(300);
		$("#" + id + "c").slideUp(300);
	};
	$scope.clickget = function(id) {
		$("#" + id + "d").hide();
		$("#" + id + "a").slideUp(300);
		$("#" + id + "b").slideDown(300);
		$("#" + id + "c").slideDown(300);
	};

	$scope.getAward = function(usermissionId) {
		//		alert(usermissionId);
		$scope.httpurl = "http://192.168.2.43:3000/mission/getmissionAward"
		$http({
			method : 'POST',
			url : $scope.httpurl,
			data : {
				"usermissionId" : usermissionId
			}
		}).success(function(data, status, headers, config) {
			for (var i = 0; i < $scope.MissionListAll.length; i++) {
				for (var t = 0; t < $scope.MissionListAll[i].length; t++) {
					if (usermissionId == $scope.MissionListAll[i][t].usermission._id) {
						$scope.MissionListAll[i][t].usermission.status = 3;
					}
				}
			}
		}).error(function(data, status, headers, config) {
			alert("网络不给力~~连接失败了..╥﹏╥.." + data);
		});
	}
});
