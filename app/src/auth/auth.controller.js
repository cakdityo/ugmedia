(function () {
    'use strict';

    angular
        .module('app.auth')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['Auth', 'User', '$firebaseRef', '$mdDialog', '$state'];

    function AuthController(Auth, User, $firebaseRef, $mdDialog, $state) {

        var vm = this;
        var isNewUser = false;

        Auth.$onAuthStateChanged(function (user) {
            if (user && isNewUser) {
                vm.initUser(user);
                isNewUser = false;
            }
        });

        vm.activation = activation;
        vm.initUser = initUser;
        vm.showLogin = showLogin;

        vm.user = {email: '', password: ''};

        function activation() {
            Auth.$createUserWithEmailAndPassword(vm.user.email, vm.user.password).then(function () {
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

        function showLogin(ev) {
            $mdDialog.show({
                controller: function ($scope, $mdDialog, $timeout) {
                    $scope.login = function (auth) {
                        var user = User.getByUsername(auth.username);
                        user.$loaded().then(function () {
                            user = User.get(user.$value);
                            user.$loaded().then(function () {
                                $scope.user = user;
                                Auth.$signInWithEmailAndPassword(user.email, auth.password).then(function () {
                                    $scope.hide
                                    $state.go('user');
                                    $timeout(function(){
                                        $mdDialog.hide();
                                    }, 3000);
                                }, function (error) {
                                    $scope.error = error;
                                });
                            });
                        });
                    };
                },
                templateUrl: 'src/auth/authLogin.template.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        }
    }
})();