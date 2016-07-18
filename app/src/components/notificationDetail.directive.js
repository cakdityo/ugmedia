(function(){
    'use strict';

    angular
        .module('app.component')
        .directive('ugNotificationDetail', ugNotificationDetail);

    function ugNotificationDetail(){
        return {
            scope: {
                notification: '=',
                notifications: '='
            },
            templateUrl: 'src/components/notificationDetail.html',
            replace: true,
            controller: NotificationDetailController
        };

        function NotificationDetailController(Post, User, $state, $scope){

            $scope.navigateToNotification = navigateToNotification;
            $scope.post = Post.get($scope.notification.post);
            $scope.sender = User.get($scope.notification.sender);

            //check if post doesn't exist, so remove the notification
            $scope.post.$watch(function(){
                if(!$scope.post.author){
                    $scope.notifications.$remove($scope.notification);
                }
            });

            function navigateToNotification(notification){
                if (notification.post){
                    $state.go('user.post', {postID: notification.post});
                }
            }
        }
    }
})();