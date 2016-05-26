(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserController', UserController);

    UserController.$inject = ['user','users'];

    function UserController(user, users){
        var vm = this;

        //Initialize the authenticated users data
        vm.auth = user.auth;
        vm.user = {};
        vm.user.objects = user.objects;
        vm.user.profile = user.profile;
        vm.users = users;

    }
})();