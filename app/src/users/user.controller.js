(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserController', UserController);

    UserController.$inject = ['user'];

    function UserController(user){
        var vm = this;

        //Initialize the authenticated users data
        vm.auth = user.auth;
        vm.countObject = countObject;
        vm.user = {};
        vm.user.objects = user.objects;
        vm.user.profile = user.profile;

        console.log(vm.user);

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

    }
})();