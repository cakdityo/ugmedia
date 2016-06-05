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

        function FollowButtonController($scope){

            $scope.followUser = followUser;
            $scope.unfollowUser = unfollowUser;

            function followUser(){
                $scope.authUser.profile.setFollow($scope.user.$id);
            }

            function unfollowUser(){
                $scope.authUser.profile.setUnfollow($scope.user.$id)
            }
        }
    }
})();