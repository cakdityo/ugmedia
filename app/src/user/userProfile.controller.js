(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = ['$firebaseRef','person'];

    function UserProfileController($firebaseRef, person){
        var vm = this;

        vm.countObject = countObject;
        vm.followUser = followUser;
        vm.unFollowUser = unFollowUser;
        vm.user = {};
        vm.user.profile = person.profile;
        vm.user.objects = person.objects;
        console.log(person);

        /*
            Helper function to count keys in an object.
            Is it correct to put it here? No of course.
         */
        function countObject(obj){
            if (obj){
                return Object.keys(obj).length;
            } else {
                return 0;
            }
        }
        /*
            ============= Follow User =============
            1. Set vm.profile.follow to true.
            2. Set {authID}/following/{userID}/true.
            3. Set {userID}/followers/{authID}/true.
         */
        function followUser(authUserID, userID){
            if (!vm.user.objects.followers){
                vm.user.objects.followers = {};
            }
            vm.user.objects.followers[authUserID] = true;
            $firebaseRef.userObjects
                .child(authUserID)
                .child('following')
                .child(userID)
                .set(true);
            $firebaseRef.userObjects
                .child(userID)
                .child('followers')
                .child(authUserID)
                .set(true);
        }

        /*
         ============ UnFollow user ============
         1. Set vm.profile.follow to false.
         2. Set {authID}/following/{userID}/null.
         3. Set {userID}/followers/{authID}/null.
         */
        function unFollowUser(authUserID, userID){
            vm.user.objects.followers[authUserID] = null;
            $firebaseRef.userObjects
                .child(authUserID)
                .child('following')
                .child(userID)
                .set(null);
            $firebaseRef.userObjects
                .child(userID)
                .child('followers')
                .child(authUserID)
                .set(null);
        }

    }
})();