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
            replace: true,
            controller: NotificationDetailController
        };

        function NotificationDetailController($scope, DataService, $state){

            $scope.navigateToNotification = navigateToNotification;
            $scope.sender = DataService.getUser($scope.notification.sender);

            function navigateToNotification(notification){
                if (notification.post){
                    $state.go('user.post', {postID: notification.post});
                }
            }
        }
    }
})();