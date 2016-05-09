(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserController', UserController);

    UserController.$inject = ['user'];

    function UserController(user){
        var vm = this;

        //Initialize the authenticated user data
        vm.auth = user.auth;
        vm.user = {};
        vm.user.objects = user.objects;
        vm.user.profile = user.profile;

        console.log(vm.user);

    }
})();