(function(){
    'use strict';

    angular
        .module('app.auth')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['Auth', 'User', '$firebaseRef', '$state'];

    function AuthController(Auth, User, $firebaseRef, $state){
        var vm = this;
        var isNewUser = false;

        Auth.$onAuthStateChanged(function (user) {
            if (user && isNewUser){
                vm.initUser(user);
                isNewUser = false;
            }
        });

        vm.activation = activation;
        vm.initUser = initUser;
        vm.login = login;

        vm.user = {email: '', password: ''};

        function activation(){
            Auth.$createUserWithEmailAndPassword(vm.user.email, vm.user.password).then(function () {
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
            var user = User.getByUsername(vm.user.username);
            user.$loaded().then(function(){
                user = User.get(user.$value);
                user.$loaded().then(function(){
                    Auth.$signInWithEmailAndPassword(user.email, vm.user.password).then(function (auth) {
                        $state.go('user');
                    }, function (error) {
                        vm.error = error;
                    });
                });
            });
        }
    }
})();