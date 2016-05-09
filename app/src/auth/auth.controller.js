(function(){
    'use strict';

    angular
        .module('app.auth')
        .controller('AuthController', AuthController);

    function AuthController($firebaseAuthService, $firebaseRef, $state){
        var vm = this;
        var isNewUser = false;

        $firebaseAuthService.$onAuth(function (authData) {
            if (authData && isNewUser){
                vm.initUser(authData);
                isNewUser = false;
            }
        });

        vm.activation = activation;
        vm.initUser = initUser;
        vm.login = login;

        vm.user = {email: '', password: ''};

        function activation(){
            $firebaseAuthService.$createUser(vm.user).then(function () {
                vm.login();
                isNewUser = true;
            }, function (error) {
                vm.error = error;
            });
        }

        function initUser(authData) {
            var username = authData.password.email.replace(/@.*/, '');
            $firebaseRef.userIDs.child(username).set(authData.uid);
            $firebaseRef.users.child(authData.uid).set({
                username: username,
                name: username,
                email: authData.password.email,
                avatar: 'https://www.mautic.org/media/images/default_avatar.png',
                filter: username
            });
        }

        function login(){
            $firebaseAuthService.$authWithPassword(vm.user).then(function (auth) {
                $state.go('user.home');
            }, function (error) {
                vm.error = error;
            });
        }
    }
})();