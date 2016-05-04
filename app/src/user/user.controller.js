(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserController', UserController);

    UserController.$inject = ['auth','profile'];

    function UserController(auth, profile){
        var vm = this;

        //Initialize the authenticated user data
        vm.auth = auth;
        vm.profile = profile;

    }
})();