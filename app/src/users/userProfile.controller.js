(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = ['person','DataService'];

    function UserProfileController(person, DataService){
        var vm = this;

        vm.followUser = followUser;
        vm.unFollowUser = unFollowUser;
        vm.user = {};
        vm.user.profile = person.profile;
        vm.user.objects = person.objects;

        /*
         ============= Follow User =============
         1. Set vm.user.objects.followers[authUserID] to true.
         2. Set {authID}/following/{userID}/true.
         3. Set {userID}/followers/{authID}/true.
         */
        function followUser(authUserID, userID){
            var state = true;

            //fix undefined variable issue
            if (!vm.user.objects.followers){
                vm.user.objects.followers = {};
            }

            vm.user.objects.followers[authUserID] = state;
            DataService.setUserFollower(userID, authUserID, state);
            DataService.setUserFollowing(authUserID, userID, state);
        }

        /*
         ============ UnFollow users ============
         1. Set vm.user.objects.followers[authUserID] to null.
         2. Set {authID}/following/{userID}/null.
         3. Set {userID}/followers/{authID}/null.
         */
        function unFollowUser(authUserID, userID){
            var state = null;

            vm.user.objects.followers[authUserID] = state;
            DataService.setUserFollower(userID, authUserID, state);
            DataService.setUserFollowing(authUserID, userID, state);
        }

    }
})();