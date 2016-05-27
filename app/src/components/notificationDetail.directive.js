(function(){

    'use strict';

    angular
        .module('app.component')
        .directive('ugNotificationDetail', ugNotificationDetail);

    function ugNotificationDetail(){
        return {
            scope: {
                notification: '='
            },
            templateUrl: 'src/components/notificationDetail.html',
            controller: NotificationDetailController,
            controllerAs: 'nd'
        };

        function NotificationDetailController($scope, $state, DataService){
            var vm = this;

            vm.navigateTo = navigateTo;
            vm.sender = DataService.getUser($scope.notification.sender);

            if ($scope.notification.comment){
                vm.comment = DataService.getPostComment($scope.notification.post, $scope.notification.comment);
            }

            function navigateTo(state, params){
                $state.go(state, params);
            }
        }
    }

})();