var page = angular.module("school", ['commonDirect','ngDialog']);
page.controller("schoolCtrl", function($scope,$rootScope,$http,Common,ngDialog) {

    $scope.chooseSchool=function(school){
        $rootScope.user.school=school;
        $rootScope.schoolName=school;
        if($rootScope.chooseSchoolType==1){
            var dialog1 = $rootScope.dialogs[$rootScope.dialogs.length - 1];
            var dialog2 = $rootScope.dialogs[$rootScope.dialogs.length - 2];
            var dialog3 = $rootScope.dialogs[$rootScope.dialogs.length - 3];
            ngDialog.close(dialog1.attr('id'));
            ngDialog.close(dialog2.attr('id'));
            ngDialog.close(dialog3.attr('id'));
        }else{
            var dialog1 = $rootScope.dialogs[$rootScope.dialogs.length - 1];
            var dialog2 = $rootScope.dialogs[$rootScope.dialogs.length - 2];
            var dialog3 = $rootScope.dialogs[$rootScope.dialogs.length - 3];
            var dialog4 = $rootScope.dialogs[$rootScope.dialogs.length - 4];
            ngDialog.close(dialog1.attr('id'));
            ngDialog.close(dialog2.attr('id'));
            ngDialog.close(dialog3.attr('id'));
            ngDialog.close(dialog4.attr('id'));
        }
    }
});
