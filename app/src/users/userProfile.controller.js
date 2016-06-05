(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = ['person'];

    function UserProfileController(person){
        var vm = this;

        vm.user = {};
        vm.user.followers = person.getFollowers();
        vm.user.following = person.getFollowing();
        vm.user.posts = person.getPosts();
        vm.user.profile = person;

    }
})();