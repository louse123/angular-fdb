/**
 * Created by a on 2015/9/9.
 */
var coffersApp = angular.module('coffersInfo', ['commonDirect', 'ngDialog']);
coffersApp.controller('myGoldCtrl', function ($scope, $http, $rootScope, Common, ngDialog) {

    //已拥有的金币总数量
    $scope.myMoneyAllNum = 0;
    //充值的金币
    $scope.myCashMoney = 0;
    //可使用提现的金币
    $scope.myGetMoney = $scope.myMoneyAllNum - $scope.myCashMoney;
    //这里是提现按钮
    $scope.getmoney = function () {
        ngDialog.open({
            template: "drawmoney/drawmoney-info.tpl.html",
            controller: "mydrawmoney",
            data:{
                "myGetMoney" : $scope.myGetMoney
            }
        });
    };

    $scope.testdate = new Date();

    //前端遍历需要的一个整体的数组 于 年份月份的子对象
    $scope.coffersListAll = {};
    $scope.myMoneyAll = [];

    //获取数据服务的方法   需要一个值进行判断获取的是收入还是支出   形参变量为chose  现假定  1 为收入 2 为支出
    $scope.getserver = function (chose) {
        $http({
                method: 'GET',
                url: $scope.serverUrl,
                json: true
            }
        ).success(function (data, status, headers, config) {
                if (chose == 1) {
                    $scope.coffersListAll = data;
                    $scope.myMoneyAllNum = $scope.coffersListAll.total;
                    $scope.myCashMoney = $scope.coffersListAll.recharge;
                    $scope.myGetMoney = $scope.coffersListAll.cash;
                    for (var i = 0; i < $scope.coffersListAll.incomeList.length; i++) {
                        $scope.coffersListAll.incomeList[i].createTime = $scope.disposeTime($scope.coffersListAll.incomeList[i].createTime);
                    }
                }
                if(chose==2){
                    $scope.coffersListAll.incomeList = data.outList;
                    for (var i = 0; i < $scope.coffersListAll.incomeList.length; i++) {
                        $scope.coffersListAll.incomeList[i].createTime = $scope.disposeTime($scope.coffersListAll.incomeList[i].createTime);
                    }
                }

            }).error(function (data, status, headers, config) {
                alert("网络不给力~~连接失败了..╥﹏╥..");
            });
    };
    //chose判断函数
    $scope.getDetail = function (chose) {
        //获取数据服务的地址(支出收入的获取视后台获取方式变动)
        if (chose == 1) {
            $scope.serverUrl = Common.baseURL + "/goldStore/incomeList";
        }
        if (chose == 2) {
            $scope.serverUrl = Common.baseURL + "/goldStore/outList";
        }
        $scope.getserver(chose);
    };
    //初始进入页面加载数据
    $scope.getDetail(1);


    //月份判断
    $scope.monthobj = {};
    $scope.monthnum = {};
    $scope.choseMonth = function (time, num) {
        var yearAndMonth = time.getFullYear() * 100 + time.getMonth();
        //工作备忘  更具$index判断
        if ($scope.monthobj[yearAndMonth] == undefined) {
            $scope.monthobj[yearAndMonth] = yearAndMonth;
            $scope.monthnum[yearAndMonth] = num;
            return true;
        } else {
            if ($scope.monthnum[yearAndMonth] == num) {
                return true;
            } else {
                return false;
            }
        }
    }

    //时间问题处理(数据库取出来的是字符串所以要手动进行整理)  date为数据库取出来的日期
    $scope.disposeTime = function (getdate) {
        var date = new Date();
        date.setFullYear(getdate.substring(0, 4));
        //这里备注,如果不在月份设置-1 显示整体时间的时候会多一个月,
        // 但是用getMonth()方法取到的是正确的,所以getMonth()方法需要+1
        date.setMonth(getdate.substring(5, 7) - 1);
        //这里备注日期设置会比正常显示整体时间的时候少一天,但是getDate()方法是正确的,
        // 所以需要在getDate()方法中+1;
        date.setDate(getdate.substring(8, 10));
        date.setHours(getdate.substring(11, 13));
        date.setMinutes(getdate.substring(14, 16));
        date.setSeconds(getdate.substring(17, 19));
        return date;
    };

    $scope.GotoGetMoney = function () {
        alert("赚取金币");
        $scope.closeThisDialog(0);
    };

    ////APiCloud
    //$scope.stateReady(function () {
    //    $scope.scrolltoBottom();
    //    $scope.mRefresh();
    //});

    //前端界面控制
    $scope.imgMoneyAdd = "img/coffers/coffers_money+b.png"
    $scope.imgMoneyMinus = "img/coffers/coffers_money-w.png"
    $scope.btnisActive = true;
    $scope.btnChose = function (num) {
        if (num == 1) {
            $scope.btnisActive = true;
            $scope.imgMoneyAdd = "img/coffers/coffers_money+b.png";
            $scope.imgMoneyMinus = "img/coffers/coffers_money-w.png";
            $scope.getDetail(1);
        }
        if (num == 2) {
            $scope.btnisActive = false;
            $scope.imgMoneyAdd = "img/coffers/coffers_money+w.png";
            $scope.imgMoneyMinus = "img/coffers/coffers_money-b.png";
            $scope.getDetail(2);
        }
    }
});