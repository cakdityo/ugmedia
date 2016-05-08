(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = ['$stateParams', 'user', 'userObjects', 'DataService','$firebaseRef'];

    function UserProfileController($stateParams, user, userObjects, DataService, $firebaseRef){
        var vm = this;

        vm.countObject = countObject;
        vm.user = {};
        vm.user.profile = {};
        vm.user.objects = {};
        vm.followUser = followUser;
        vm.unFollowUser = unFollowUser;

        //Initialize user's profile.
        user.$loaded().then(function(){
            if (user.username != $stateParams.username){
                //Initialize only the unauthenticated user
                DataService.getUserByUsername($stateParams.username).$loaded().then(function(profile){
                    vm.user.profile = profile[0];
                    DataService.getUserObjects(vm.user.profile.$id).$loaded().then(function(userObjects){
                        vm.user.objects = userObjects;
                    });
                });
                console.log(vm.profile);
            } else {
                //Initialize the authenticated user
                vm.user.profile = user;
                vm.user.objects = userObjects;
            }
        });

        function countObject(obj){
            if (obj){
                return Object.keys(obj).length;
            } else {
                return 0;
            }
        }
        /*
            =========== Follow User ===========
            1. Set vm.profile.follow to true
            2. Set {auth}/following/{user}/true
            3. Set {user}/followers/{auth}/true
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
         ========== UnFollow user ==========
         1. Set vm.profile.follow to false
         2. Set {auth}/following/{user}/null
         3. Set {user}/followers/{auth}/null
         */
        function unFollowUser(authUserID, userID){
            if (!vm.user.objects.followers){
                vm.user.objects.followers = {};
            }
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