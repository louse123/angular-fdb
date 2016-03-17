/**
 * Created by a on 2015/9/11.
 */
var chooseApp = angular.module('chooseschoolInfo', ['commonDirect', 'ngDialog', 'myschoolAddr', 'storage']);
chooseApp.controller('chooseschoolCtr', function ($scope, $http, $rootScope, Common, ngDialog, myschoolAddrlfac, Store) {
    /**
     * 这里是前台搜索框的实现
     * 1.点击搜索按钮可以按照输入框输入的内容搜索
     * 2.输入了信息以后,会在1.5秒后自动查询,如果在1.5秒之间再次输入的话,那么时间将会重置
     * 3.清楚输入框输入信息的清楚按钮
     */
        //home图标ngclass
    $scope.homeColor = true;
    $scope.homechoose = function () {
        $scope.homeColor = !$scope.homeColor;
    }
    //初始化输入框;
    $scope.myselectSchool = "";
    //自动延时操作方法
    var mysetTime;
    $scope.selectSchoolK = function () {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        $scope.myselectSchool = $scope.myselectSchool.replace(pattern, "");
        if (mysetTime) {
            clearTimeout(mysetTime);
        }
        if ($scope.myselectSchool != "" && $scope.myselectSchool != undefined) {
            mysetTime = setTimeout(function () {
                $scope.selectSchoolC();
            }, 0);
        }
    };
    //这里是点击查询的方法
    $scope.requestMySchool = function (name, province, city) {
        $scope.endResult = false;
        $scope.createSchoolUrl = Common.baseURL + "/createSchool/createSchool";
        var SchoolInfo = {
            "name": name,
            "province": province,
            "city": city
        };
        $http({
            method: 'POST',
            url: $scope.createSchoolUrl,
            data: {
                "SchoolInfo": SchoolInfo,
                "method": "st"   //st是查看是否有同名学校并返回学校数据,ss只查不返回, ct是创建学校并返回数据 cs是创建不返回
            }
        }).success(function (data, status, headers, config) {
            //alert(data[0].name);
            if (data.endResult) {
                $scope.GetschoolList = [];
            } else {
                $scope.GetschoolList = data;
            }
        }).error(function (data, status, headers, config) {
            alert("网络不给力~~连接失败了..╥﹏╥.." + data);
        });
    };
    //这是前台得到的数据
    var newinputString = [];
    $scope.selectSchoolC = function () {
        if ($scope.myselectSchool != "" && $scope.myselectSchool != undefined) {
            var newinputString = [];
            //对输入字符进行递归分析
            if ($scope.myselectSchool.indexOf(" ") > 0) {
                var juststring = $scope.myselectSchool + "";

                function analyze() {
                    var num = juststring.indexOf(" ");
                    //将截取的字符串加入数组
                    newinputString.push(juststring.substring(0, num));
                    //将旧的字符串接去新的字符串
                    juststring = juststring.substring(juststring.indexOf(" ") + 1);
                    //判断字符串是否还有空格
                    if (juststring.indexOf(" ") > 0) {
                        analyze();
                    } else {
                        newinputString.push(juststring);
                        addr();
                    }
                }

                analyze();
            } else {
                newinputString.push($scope.myselectSchool);
                addr();
            }
            function addr() {
                if ($scope.homeColor) {
                    //var analyzeData = myschoolAddrlfac.clientCompar(newinputString);
                    //var schoolList = [];
                    //for (var i = 0; i < analyzeData.schoollist.length; i++) {
                    //    if (analyzeData.schoollist[i] != "" && analyzeData.schoollist[i] != undefined) {
                    //        schoolList.push(analyzeData.schoollist[i]);
                    //    }
                    //}
                    //var provinceList = [];
                    //provinceList.push(Store.getStorage('user').user.province);
                    //var cityList = [];
                    //cityList.push(Store.getStorage('user').user.city);
                    $scope.requestMySchool($scope.myselectSchool, Store.getStorage('user').user.province, Store.getStorage('user').user.city);

                } else {
                    //var analyzeData = myschoolAddrlfac.clientCompar(newinputString);
                    ////学校列表的空值处理
                    //var provinceList = analyzeData.provincelist;
                    //var cityList = analyzeData.citylist;
                    //var schoolList = [];
                    //for (var i = 0; i < analyzeData.schoollist.length; i++) {
                    //    if (analyzeData.schoollist[i] != "" && analyzeData.schoollist[i] != undefined) {
                    //        schoolList.push(analyzeData.schoollist[i]);
                    //    }
                    //}
                    //$scope.requestMySchool(schoolList,provinceList,cityList);
                }
            }
        }
    };
    //点击单条记录操作
    $scope.GetSchool = function (num) {
        alert("这是编号:" + num);
    };


    //清除方法
    $scope.clearInput = function () {
        $scope.myselectSchool = "";
    };
    //这里是创建学校的跳转
    $scope.createmySchool = function () {
        ngDialog.open({
            template: "chooseschool/createschool-info.tpl.html",
            controller: "createschoolCtr"
        })
    }


    //学校的迭代输出
    $scope.GetschoolList = [];
    //测试数据
});
