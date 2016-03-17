/**
 * Created by a on 2015/9/11.
 */
var chooseApp = angular.module('createschoolInfo', ['commonDirect', 'ngDialog', 'myschoolAddr']);
chooseApp.controller('createschoolCtr', function ($scope, $http, $rootScope, Common, ngDialog, myschoolAddrlfac) {
    //获取省市信息
    $scope.provinceList = [];
    $scope.cityList = [];
    $scope.provinceAndcityList = [];
    //省份选择方法
    $scope.chosePro = function () {
        $scope.mypro = "";
        $scope.mycity = "";
        $scope.provinceAndcityList = [];
        for (pro in myschoolAddrlfac.provinceCity.province) {
            var justprovince = {
                "num": pro,
                "pcname": myschoolAddrlfac.provinceCity.province[pro] + "省",
                "pctype": "pro"//为了chooseCity使用
            };
            $scope.provinceAndcityList.push(justprovince);
        }
    }
    //城市选择方法
    $scope.chooseCity = function (num, name, pctype) {
        //alert(myschoolAddrlfac.provinceCity.city[num][1])
        //alert(type);
        if (pctype == "pro") {
            $scope.mypro = name + "";
            $scope.provinceAndcityList = [];
            for (city in myschoolAddrlfac.provinceCity.city[num]) {
                //alert(myschoolAddrlfac.provinceCity.city[num][city])
                var justCity = {
                    "num": city,
                    "pcname": myschoolAddrlfac.provinceCity.city[num][city] + "市",
                    "pctype": "city"//为了chooseCity使用
                };
                $scope.provinceAndcityList.push(justCity);
            }
        } else if (pctype == "city") {
            $scope.mycity = name + "";
            $scope.btnisActiveFun();
            if ($scope.SchoolInput != "" && $scope.SchoolInput != undefined) {
                if ($scope.SchoolInput.length > 0) {
                    if ($scope.SchoolInput.length > 0 && $scope.mypro != "" && $scope.mycity != "") {
                        $scope.requestCreate("ss")
                    }
                }
            }
        }
    };
    //模态窗打开方法
    $scope.openProCity = function () {
        $scope.chosePro();
        $('#mydaddress').modal('show')
    };
    $scope.mypro = "";
    $scope.mycity = "";
    //点击选择地点
    $scope.selectadrrs = function () {
        if ($scope.mypro == "" || $scope.mycity == "") {
            alert("学校地址不完善哦~")
        } else {
            $('#mydaddress').modal('hide')
        }
    }
    //学校名称的输入
    $scope.SchoolInput;
    //底部按钮激活方法
    $scope.CbtnisActive = false;
    $scope.btnisActiveFun = function () {
        if ($scope.mypro != "" && $scope.mycity != "" && $scope.SchoolInput != "" && $scope.SchoolInput != undefined) {
            $scope.CbtnisActive = true;
        } else {
            $scope.CbtnisActive = false;
        }
    }
    //输入框change函数
    var mysetTime;
    var mysetTime2;
    $scope.createInputChange = function () {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        $scope.SchoolInput = $scope.SchoolInput.replace(pattern, "");
        if ($scope.SchoolInput != "" && $scope.SchoolInput != undefined) {
            if ($scope.SchoolInput.length > 0 && $scope.mypro != "" && $scope.mycity != "") {
                $scope.requestCreate("ss");
            }
        }
    };
    //确认提交
    $scope.sendSchool = function () {
        $scope.requestCreate("cs");
    };
    //请求通用结果确认
    $scope.endResult = false;
    $scope.requestCreate = function (chose) {
        $scope.endResult = false;
        var CTS = chose;
        $scope.createSchoolUrl = Common.baseURL + "/createSchool/createSchool";
        var SchoolInfo = {
            "name": $scope.SchoolInput,
            "province": $scope.mypro,
            "city": $scope.mycity
        };
        $http({
            method: 'POST',
            url: $scope.createSchoolUrl,
            data: {
                "SchoolInfo": SchoolInfo,
                "method": CTS   //st是查看是否有同名学校并返回学校数据,ss只查不返回, ct是创建学校并返回数据 cs是创建不返回
            }
        }).success(function (data, status, headers, config) {
            if (CTS == "ss") {
                //alert(data.endResult);
                if (data.endResult == true) {
                    $scope.endResult = true;
                    //$('#mySchoolInfo').modal('show')
                    //alert($scope.endResult);
                } else {
                    $scope.endResult = false;
                    $('#mySchoolInfo').modal('show')
                }

            } else if (CTS == "cs") {
                alert("恭喜 创建成功了");
                $scope.closeThisDialog(0);
            }
        }).error(function (data, status, headers, config) {
            alert("网络不给力~~连接失败了..╥﹏╥.." + data);
        });
    };
    $scope.schoolInfofun = function (num) {
        if (num == 0) {
            $scope.mypro = "";
            $scope.mycity = "";
            $scope.endResult = false;
            $('#mySchoolInfo').modal('hide');
        } else if (num == 1) {
            $('#mySchoolInfo').modal('hide');
        } else if (num == 2) {
            //$scope.SchoolInput = "";
            $('#mySchoolInfo').modal('hide');
        }
    };
    //关闭模态窗事件

});
