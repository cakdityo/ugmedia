(function () {
    'use strict';

    angular
        .module('app')
        .constant('FirebaseUrl', 'http://ug-media.firebaseio.com/')
        .config(function ($firebaseRefProvider, FirebaseUrl, $stateProvider) {
            $firebaseRefProvider.registerUrl({
                default: FirebaseUrl,
                userIDs: FirebaseUrl + 'userIDs',
                users: FirebaseUrl + 'users',
                userObjects: FirebaseUrl + 'userObjects'
            });

            $stateProvider
                .state('auth', {
                    url: '/',
                    templateUrl: 'src/auth/auth.html',
                    controller: 'AuthController as vm',
                    resolve: {
                        requireNoAuth: function ($state, $firebaseAuthService) {
                            return $firebaseAuthService.$requireAuth().then(function (auth) {
                                $state.go('user.home');
                            }, function (error) {
                                return;
                            });
                        }
                    }
                })
                .state('user', {
                    templateUrl: 'src/user/user.html',
                    controller: 'UserController as U',
                    resolve: {
                        auth: function ($state, $firebaseAuthService) {
                            return $firebaseAuthService.$requireAuth().catch(function () {
                                $state.go('auth');
                            });
                        },
                        user: function ($firebaseAuthService, DataService) {
                            return $firebaseAuthService.$requireAuth().then(function (auth) {
                                return DataService.getUser(auth.uid);
                            });
                        },
                        userObjects: function ($firebaseAuthService, DataService) {
                            return $firebaseAuthService.$requireAuth().then(function (auth) {
                                return DataService.getUserObjects(auth.uid);
                            })
                        }
                    }
                })
                .state('user.home', {
                    url: '/',
                    templateUrl: 'src/user/userHome.html',
                    controller: 'UserHomeController as UH'
                })
                .state('user.settings', {
                    url: '/settings/{token}',
                    templateUrl: 'src/user/userSettings.html',
                    controller: 'UserSettingsController as US',
                    onEnter: function ($state, $stateParams, auth) {
                        if ($stateParams.token != auth.token) {
                            $state.go('user.home');
                        }
                    }
                })
                .state('user.profile', {
                    url: '/{username}',
                    templateUrl: 'src/user/userProfile.html',
                    controller: 'UserProfileController as UP'
                });
        });
})();