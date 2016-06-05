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

        function NotificationDetailController(User, $state, $scope){

            $scope.navigateToNotification = navigateToNotification;
            $scope.sender = User.get($scope.notification.sender);

            function navigateToNotification(notification){
                if (notification.post){
                    $state.go('user.post', {postID: notification.post});
                }
            }
        }
    }
})();