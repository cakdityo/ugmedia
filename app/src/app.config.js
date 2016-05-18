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
                    templateUrl: 'src/users/users.html',
                    controller: 'UserController as U',
                    resolve: {
                        user: function (DataService, $firebaseAuthService, $state) {
                            return $firebaseAuthService.$requireAuth()
                                .then(function (auth) {
                                    return {
                                        auth: auth,
                                        profile: DataService.getUser(auth.uid),
                                        objects: DataService.getUserObjects(auth.uid)
                                    };
                                }).catch(function () {
                                    $state.go('auth');
                                });
                        }
                    }
                })
                .state('user.home', {
                    url: '/',
                    templateUrl: 'src/users/userHome.html',
                    controller: 'UserHomeController as UH'
                })
                .state('user.settings', {
                    url: '/settings/{token}',
                    templateUrl: 'src/users/userSettings.html',
                    controller: 'UserSettingsController as US',
                    onEnter: function ($state, $stateParams, user) {
                        if ($stateParams.token !== user.auth.token) {
                            $state.go('user.home');
                        }
                    }
                })
                .state('user.profile', {
                    url: '/{username}',
                    templateUrl: 'src/users/userProfile.html',
                    controller: 'UserProfileController as UP',
                    resolve: {
                        person: function (user, $stateParams, DataService) {
                            if (user.profile.username !== $stateParams.username) {
                                return DataService.getUserByUsername($stateParams.username).$loaded().then(function (profile) {
                                    return {
                                        profile: profile[0],
                                        objects: DataService.getUserObjects(profile[0].$id)
                                    };
                                });
                            } else {
                                return user;
                            }
                        }
                    }
                })
                .state('user.profile.followers', {
                    url: '/followers',
                    templateUrl: 'src/users/userProfileFollow.html',
                    controller: 'UserProfileFollowController as UPF',
                    resolve: {
                        friends: function (person, DataService) {
                            var friends = [];
                            angular.forEach(person.objects.followers, function(value, key){
                                friends.push(DataService.getUser(key));
                            });
                            console.log(friends);
                            return friends;
                        }
                    }
                })
                .state('user.profile.following', {
                    url: '/following',
                    templateUrl: 'src/users/userProfileFollow.html',
                    controller: 'UserProfileFollowController as UPF',
                    resolve: {
                        friends: function (person, DataService) {
                            var friends = [];
                            angular.forEach(person.objects.following, function(value, key){
                                friends.push(DataService.getUser(key));
                            });
                            console.log(friends);
                            return friends;
                        }
                    }
                })
        });
})();