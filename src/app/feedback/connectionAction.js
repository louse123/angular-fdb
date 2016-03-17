/**
 * Created by a on 2015/9/23.
 */

var conAction = angular.module('connectionAction', []);
conAction.directive("conActionCtr", function () {
    return {
        restrict: 'E',
        template: '<div style="padding-top: 200px;" class="col-xs-12"><img class="center-block" src="img/worry-m.png"></div>',
        replace: true
    };
});
conAction.directive("connectWait", function () {
    return {
        restrict: 'E',
        template: '<div style="z-index: 99;position: absolute;display: block;width: 100%;height: 100%;border: none;;background-color:rgba(0, 0, 0, 0.10);"><div class="text-center" style="color:white;line-height: 120px;font-size: 200%;position: absolute;background-color:rgba(0, 0, 0, 0.50);display: block;height: 120px;width: 100%;top: 35%;left: 0;">' +
        '正在处理中 请稍后...</div></div>',
        replace: true
    }
});
