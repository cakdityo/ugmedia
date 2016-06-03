(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserController', UserController);

    UserController.$inject = ['Auth', 'user','users','$state'];

    function UserController(Auth, user, users, $state){
        var vm = this;

        //Initialize the authenticated users data
        Auth.$onAuthStateChanged(function(auth){
            if (!auth) {
                $state.go('auth');
            }
        });

        vm.user = {};
        vm.user.feeds = user.getFeeds();
        vm.user.followers = user.getFollowers();
        vm.user.following = user.getFollowing();
        vm.user.notifications = user.getNotifications();
        vm.user.posts = user.getPosts();
        vm.user.profile = user;
        vm.users = users;

    }
})();