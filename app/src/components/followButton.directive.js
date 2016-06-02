(function(){

    'use strict';

    angular
        .module('app.component')
        .directive('ugFollowButton', ugFollowButton);

    function ugFollowButton(){
        return {
            scope: {
                authUser: '=',
                user: '='
            },
            templateUrl: 'src/components/followButton.html',
            controller: FollowButtonController
        };

        function FollowButtonController($scope, DataService){

            $scope.followUser = followUser;
            $scope.unfollowUser = unfollowUser;

            function followUser(authUserID, userID){
                var state = true;

                DataService.setUserFollower(userID, authUserID, state);
                DataService.setUserFollowing(authUserID, userID, state);
            }

            function unfollowUser(authUserID, userID){
                var state = null;

                DataService.setUserFollower(userID, authUserID, state);
                DataService.setUserFollowing(authUserID, userID, state);
            }
        }
    }
})();