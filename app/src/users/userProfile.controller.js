(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = ['person','DataService'];

    function UserProfileController(person){
        var vm = this;

        vm.user = {};
        vm.user.profile = person.profile;
        vm.user.objects = person.objects;

    }
})();