(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = ['user'];

    function UserProfileController(user){
        var vm = this;

        vm.user = user;

        console.log(vm.user);
    }
})();