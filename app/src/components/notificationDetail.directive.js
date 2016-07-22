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

        function NotificationDetailController($mdSidenav, $state, $scope){

            $scope.author = $scope.notification.getAuthor();
            $scope.post = $scope.notification.getPost();

            $scope.navigateToNotification = navigateToNotification;
            $scope.sidenavToggle = sidenavToggle;

            function navigateToNotification(notification){
                if (notification.post){
                    $state.go('user.post', {postID: notification.post});
                }
                sidenavToggle();
            }

            function sidenavToggle(){
                $mdSidenav('notifications').toggle();
            }
        }
    }
})();