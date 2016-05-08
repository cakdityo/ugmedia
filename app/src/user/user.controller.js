(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserController', UserController);

    UserController.$inject = ['auth','user','userObjects'];

    function UserController(auth, user, userObjects){
        var vm = this;

        //Initialize the authenticated user data
        vm.auth = auth;
        vm.user = {};
        vm.user.objects = userObjects;
        vm.user.profile = user;

        console.log(vm.user);

    }
})();