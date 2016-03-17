/**
 * Created by a on 2015/9/9.
 */
var coffersApp = angular.module('drawmoneyInfo', ['commonDirect', 'ngDialog', 'storage', 'connectionAction']);
coffersApp.controller('mydrawmoney', function ($scope, $http, $rootScope, Common, ngDialog, Store) {
    //步骤1  检测是否设置了提取密码
    //步骤2  检测密码是否已经锁定 如果锁定了要控制键盘输入(两个)
    //步骤1...
    //获取支付密码是否存在,并且判断支付密码是否锁定状态
    $scope.getPwdState = function () {
        //请求等待效果
        $scope.conWait = true;
        //提现服务地址
        $scope.getPwdStateUrl = "";
        //请求过程
        $http({
            method: 'POST',
            url: $scope.getPwdStateUrl
        }).success(function (data, status, headers, config) {
            $scope.conWait = false;
            /**
             * 这个方法是请求获取支付密码是否存在,并且是否锁定支付密码的success
             * if的判断是判断是否设置了密码,自行调整,如果设置了密码,就是true
             * 如果没有设置就是false
             * 如果设置了密码还要判断是否已经锁定了,判断方法是$scope.choosePwdLock() false 是锁定了 true是没有锁定
             */
            if (true) {//控制是否有支付密码
                //密码锁$scope.choosePwdLock传入false   没有锁定传入true
                $scope.choosePwdLock(true);//控制是否被锁定
                $scope.setSafePwd1 = ['', '', '', '', '', ''];
                $scope.myPWD = "";

            } else {
                //步骤2....  传入值根据后台取到的数据判断
                $scope.chosesynnum = 1;
            }
        }).error(function (data, status, headers, config) {
            $scope.conWait = false;
            //这个方法是请求获取支付密码是否存在,并且是否锁定的error方法
            $scope.choosePwdLock(false);

            alert("网络不给力~~提交失败了..╥﹏╥..");
        });
    };
    $scope.getPwdState();

    //密码锁定判断方法
    $scope.choosePwdLock = function (boolean) {
        //提取密码的状态  1 设置密码第一次输入 2 设置密码第二次输入 3 设置密码成功或者失败 4 输入提取密码
        //密码锁定 假设锁定状态 $scope.pwdLock 为false  没锁定 为true
        $scope.pwdLock = boolean;
        if ($scope.pwdLock) {
            $scope.chosesynnum = 4;
        } else {
            $scope.chosesynnum = 8;
        }
    };
    /**
     *一下三个方法是与后台联动的方法   分别是
     * 1.设置支付密码请求服务的方法
     * 2.输入支付密码后台判断支付密码是否正确的方法.
     * 如果支付密码正确,后台并完成提现过程,那么返回密码正确判断 让$scope.realyPwd等于true 否则 为false
     * 3.获取初始的支付密码是否可用状态,如果支付密码冻结一天 那么将不可用
     */
    /**
     * 设置密码的请求方法
     */
    $scope.setPayPwd = function () {
        //请求等待效果
        $scope.conWait = true;
        //提现服务地址
        $scope.setPwdUrl = "";
        //请求过程
        $http({
            method: 'POST',
            url: $scope.setPwdUrl,
            data: {
                "payPwd": $scope.myPWD
            }
        }).success(function (data, status, headers, config) {
            $scope.conWait = false;
            //成功了跳转第3场景
            //alert("设置密码成功");
            $scope.chosesynnum = 3;
        }).error(function (data, status, headers, config) {
            $scope.conWait = false;
            //失败了不做反应处理，给予提示
            alert("网络不给力~~提交失败了..╥﹏╥..");
        });
    };
    /**
     * 判断支付密码是否输入正确
     * 这里的判断依据是密码是否相等
     * 如果相等了就在后台操作提现完成 前端显示成功
     */
    $scope.judgePwd = function () {
        //请求等待效果
        $scope.conWait = true;
        //提现服务地址
        $scope.judgeAndGetUrl = "";
        //请求过程
        $http({
            method: 'POST',
            url: $scope.judgeAndGetUrl,
            data: {
                "payPwd": $scope.myPWD,
                "moneySum": $scope.inputMoney
            }
        }).success(function (data, status, headers, config) {
            $scope.conWait = false;
            /**
             *$scope.realyPwd  为true的时候  密码正确
             *为false的时候 密码错误
             *需要赋值判断 请自行添加
             */
                //alert("提现访问成功");
            $scope.realyPwd = false;
            $scope.judgeAndGet();
        }).error(function (data, status, headers, config) {
            $scope.conWait = false;
            //访问错误 返回密码输入前状态
            //alert("提现访问失败");
            $scope.chosesynnum = 4;
            $scope.setSafePwd1 = ['', '', '', '', '', ''];
            $scope.myPWD = "";
            alert("网络不给力~~提交失败了..╥﹏╥..");
        });
    };

    //判断方法
    $scope.judgeAndGet = function () {
        if ($scope.realyPwd) {
            $scope.chosesynnum = 7;
        } else {
            if ($scope.missPWD["missNum"] > 1) {
                $scope.chosesynnum = 8;
                $scope.missPWD["lock"] = true;
            }
            else {
                $scope.chosesynnum = 6;
            }
        }
    };

    //头像mediaURLBase
    $scope.headimg = Common.downLoadBaseURL + Store.getStorage('user').user.headPic.key;
    console.log(Common.downLoadBaseURL + Store.getStorage('user').user.headPic.key);
    //用户名称
    $scope.username=Store.getStorage('user').user.name;
    //用户的金币
    $scope.mymoney = $scope.ngDialogData.myGetMoney;
    //$scope.mymoney = 5000;
    //记录密码状态  错误次数 以及 是否需要设置密码
    $scope.missPWD = {};
    $scope.missPWD["hasPWD"] = true;
    $scope.missPWD["missNum"] = 0;
    $scope.missPWD["lock"] = false;
    $scope.userPhone = "15118152289";
    ////////////////测试用数据
    //输入的密码数据
    $scope.realyPwd = "";
    //验证码需要数据
    $scope.phoneCode = "";
    $scope.phoneCodeTrue = false;
    //ngclass
    $scope.btnisActive = true;
    $scope.btnNext = true;
    //设置提现密码的上下密码数组
    $scope.setSafePwd1 = ['', '', '', '', '', ''];
    $scope.setSafePwd2 = ['', '', '', '', '', ''];
    //提现用的密码数组
    $scope.setSafePwd = ['', '', '', '', '', ''];
    //设置密码错误提示
    $scope.setPWDtwoProper = false;
    //验证码倒计时方法
    $scope.getphoneCode = function () {
        alert("验证码已发送");
        $scope.phoneCodeTrue = true;
        $scope.phoneCode = 60;
        $scope.everttimeS = setInterval(function () {
            $scope.phoneCode = $scope.phoneCode - 1;
            $scope.$apply();
            if ($scope.phoneCode <= 0) {
                $scope.phoneCodeTrue = false;
                $scope.phoneCode = "";
                clearInterval($scope.everttimeS);
            }
        }, 1000);
    };
    //设置提现密码替换输入数组,并且获取输入框焦点
    $scope.setMyGetMoneyPWD = function (num) {
        if (num == 1 && $scope.chosesynnum != 4 && $scope.chosesynnum != 5) {
            if ($scope.btnisActive == false) {
                $scope.btnisActive = true;
            }
            $scope.chosesynnum = 1;
            $scope.setSafePwd1 = ['', '', '', '', '', ''];
        }
        else if (num == 2 && $scope.chosesynnum != 4 && $scope.chosesynnum != 5) {
            if ($scope.btnisActive == true) {
                $scope.btnisActive = false;
            }
            $scope.chosesynnum = 2;
            $scope.setSafePwd2 = ['', '', '', '', '', ''];
        }
        else if ($scope.chosesynnum == 4 || $scope.chosesynnum == 5) {
            if ($scope.btnisActive == false) {
                $scope.btnisActive = true;
            }
            $scope.chosesynnum = 4;
            $scope.setSafePwd1 = ['', '', '', '', '', ''];
            $scope.setSafePwd2 = ['', '', '', '', '', ''];
        }
        else {

        }
        $scope.myPWD = "";
        setTimeout(function () {
            $("#inputPWD").focus();
        }, 100)
    };
    //触发模态窗的事件
    $scope.activeSetPwd = function () {
        if ($scope.missPWD["lock"]) {
            $scope.chosesynnum = 8;
        }
        if ($scope.chosesynnum == 1) {
            $('#mydaddress').modal('show');
            $scope.setSafePwd1 = ['', '', '', '', '', ''];
            $scope.myPWD = "";
        } else if ($scope.chosesynnum == 2) {
            $('#mydaddress').modal('show');
            $scope.setSafePwd2 = ['', '', '', '', '', ''];
            $scope.myPWD = "";
        } else if ($scope.chosesynnum == 4) {
            $('#mydaddress').modal('show');
            $scope.btnisActive = true;
            $scope.btnNext = true;
            $scope.setSafePwd1 = ['', '', '', '', '', ''];
            $scope.myPWD = "";
        } else if ($scope.chosesynnum == 5) {
            $('#mydaddress').modal('show');
            $scope.btnisActive = true;
            $scope.btnNext = true;
            $scope.setSafePwd1 = ['', '', '', '', '', ''];
            $scope.myPWD = "";
            $scope.chosesynnum = 4;
        } else {
            $('#mydaddress').modal('show')
        }
        setTimeout(function () {
            $("#inputPWD").focus();
        }, 500)

    };
    $scope.btnNext = true;
    //对每次变化的输入值进行赋值操作
    $scope.myPwdChange = function () {
        //只允许数字输入
        $scope.myPWD = $scope.myPWD.replace(/[^0-9]/ig, "");
        if ($scope.myPWD.length > 6) {
            $scope.myPWD = $scope.myPWD.substring(0, 6);
        }
        //超过六位按前六位截取
        if ($scope.myPWD.length == 6) {
            $scope.btnNext = false;
        } else {
            $scope.btnNext = true;
        }
        //设置密码第一次输入
        if ($scope.chosesynnum == 1) {
            $scope.setSafePwd1 = ['', '', '', '', '', ''];
            for (var i = 0; i < $scope.myPWD.length; i++) {
                $scope.setSafePwd1[i] = $scope.myPWD[i];
            }
        }
        //设置密码第二次输入
        if ($scope.chosesynnum == 2) {
            $scope.setSafePwd2 = ['', '', '', '', '', ''];
            for (var i = 0; i < $scope.myPWD.length; i++) {
                $scope.setSafePwd2[i] = $scope.myPWD[i];
                if (i == 5) {
                    //对比两次密码是否相等
                    for (var t = 0; t < $scope.setSafePwd1.length; t++) {
                        if ($scope.setSafePwd1[t] != $scope.setSafePwd2[t] || $scope.setSafePwd1[t] == "" || $scope.setSafePwd1[t] == undefined) {
                            //两次不相等,跳出循环,设置密码失败被重设按钮被激活
                            $scope.setPWDtwoProper = true;
                            break;
                        } else if (t == 5) {
                            //两次相等,跳出循环,设置密码失败重设按钮被否决
                            $scope.setPWDtwoProper = false;
                            $scope.realyPwd = $scope.myPWD + "";
                            //测试数据
                            //alert($scope.realyPwd);
                        }
                    }
                }
            }
        }
        if ($scope.chosesynnum == 4) {
            $scope.setSafePwd1 = ['', '', '', '', '', ''];
            for (var i = 0; i < $scope.myPWD.length; i++) {
                $scope.setSafePwd1[i] = $scope.myPWD[i];
                //判断输入的密码是否到了第六位
                if (i == 5) {
                    $scope.btnNext = false;
                    $scope.chosesynnum = 5;
                }
            }
        } else if ($scope.chosesynnum == 5 && $scope.myPWD.length < 6) {
            $scope.chosesynnum = 4;
        }
    };

    //设置密码切换事件
    $scope.GotoGetMoney = function () {
        //第一次输入和第二次输入的切换
        if ($scope.chosesynnum == 1) {
            $scope.btnisActive = false;
            $scope.chosesynnum = 2;
            $scope.myPWD = "";
            $scope.btnNext = true;
            $scope.setSafePwd2 = ['', '', '', '', '', ''];
            setTimeout(function () {
                $("#inputPWD").focus();
            }, 100)
        } else if ($scope.chosesynnum == 2) {
            $scope.setPayPwd();
        } else if ($scope.chosesynnum == 3) {
            //这里是输入提现的密码 记号4
            $scope.chosesynnum = 4;
            $scope.btnisActive = true;
            $scope.btnNext = true;
            $scope.setSafePwd1 = ['', '', '', '', '', ''];
            $scope.myPWD = "";

            $('#mydaddress').modal('hide');
            setTimeout(function () {
                $('#mydaddress').modal('show');
                setTimeout(function () {
                    $("#inputPWD").focus();
                }, 500)
            }, 500)
        } else if ($scope.chosesynnum == 5) {
            //判断输入的密码是否正确$scope.myPWD为输入的密码字符串
            $scope.judgePwd();

            //假设正确
            //$scope.chosesynnum=7;

            //假设不正确

        } else if ($scope.chosesynnum == 8) {
            $('#mydaddress').modal('hide')
        } else if ($scope.chosesynnum == 9) {
            if ($scope.inputcode != "" && $scope.inputcode != undefined) {
                $scope.chosesynnum = 1;
                $('#mydaddress').modal('hide');
                setTimeout(function () {
                    $('#mydaddress').modal('show')
                }, 500)
            } else {
                $('#mydaddress').modal('hide')
            }
        }
        //设置密码的重设密码
        if ($scope.setPWDtwoProper == true) {
            $scope.btnisActive = true;
            $scope.chosesynnum = 1;
            $scope.myPWD = "";
            $scope.setSafePwd1 = ['', '', '', '', '', ''];
            setTimeout(function () {
                $("#inputPWD").focus();
            }, 100);
            $scope.setPWDtwoProper = false;
        }
    }
    //密码错误了以后 1 继续输入 2 忘记密码
    $scope.errPWDinput = function (num) {
        if (num == 1) {
            $scope.missPWD["missNum"] = $scope.missPWD["missNum"] + 1;
            $scope.chosesynnum = 4;
            $scope.btnisActive = true;
            $scope.btnNext = true;
            $scope.setSafePwd1 = ['', '', '', '', '', ''];
            $scope.myPWD = "";
            $('#mydaddress').modal('hide')
            setTimeout(function () {
                $('#mydaddress').modal('show')
                setTimeout(function () {
                    $("#inputPWD").focus();
                }, 500)
            }, 500)
        }
        if (num == 2) {
            $scope.chosesynnum = 9;
        }
    }
//点击提现跳转设置密码或者输入密码
    $scope.buttonInfo = "提 现 金 额 不 足";
    $scope.CbtnisActive = false;
    $scope.checkInputMoney = function () {
        $scope.inputMoney = $scope.inputMoney.replace(/[^0-9]/ig, "");
        if ($scope.inputMoney >= 500 && $scope.mymoney >= 500 && $scope.inputMoney <= $scope.mymoney) {
            $scope.CbtnisActive = true;
            $scope.buttonInfo = "确 认 提 现";
        } else {
            $scope.CbtnisActive = false;
            $scope.buttonInfo = "提 现 金 额 不 足";
        }
    };

    $scope.closeThisM = function () {
        $('#mydaddress').modal('hide')
    };

    //键盘事件
    $scope.keyboard = [];
    $scope.keyboard = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    //按下数字键盘事件
    $scope.getkeyboardNum = function (num) {
        $scope.myPWD = $scope.myPWD + "" + num;
        $scope.myPwdChange();
        $("#keyboard" + num).css("background-color", "#a0a0a0");
        setTimeout(function () {
            $("#keyboard" + num).css("background-color", "#ffffff");
        }, 100);
    };
    //按下退格键事件
    $scope.keyboardDelete = function () {
        $scope.myPWD = $scope.myPWD.substring(0, $scope.myPWD.length - 1);
        $scope.myPwdChange();
        $("#keyboardDelete").css("background-color", "#a0a0a0");
        setTimeout(function () {
            $("#keyboardDelete").css("background-color", "#ffffff");
        }, 100);
    };
})
;
coffersApp.filter('setPWD', function () {
    return function (input) {
        if (input != "" && input != undefined) {
            return "*";
        } else {
            return "";
        }
    }
});