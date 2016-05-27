(function () {
    'use strict';

    angular
        .module('app')
        .constant('FirebaseUrl', 'http://ug-media.firebaseio.com/')
        .config(function ($firebaseRefProvider, FirebaseUrl, $stateProvider, $locationProvider) {

            //$locationProvider.html5Mode(true);

            $firebaseRefProvider.registerUrl({
                default: FirebaseUrl,
                userIDs: FirebaseUrl + 'userIDs',
                users: FirebaseUrl + 'users',
                userObjects: FirebaseUrl + 'userObjects',
                posts: FirebaseUrl + 'posts',
                postObjects: FirebaseUrl + 'postObjects'
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
                    templateUrl: 'src/users/user.html',
                    controller: 'UserController as U',
                    resolve: {
                        users: function(DataService){
                            return DataService.getUsers();
                        },
                        user: function (DataService, $firebaseAuthService, $state) {
                            return $firebaseAuthService.$requireAuth()
                                .then(function (auth) {
                                    return {
                                        auth: auth,
                                        posts: DataService.getUserPosts(auth.uid),
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
                                        posts: DataService.getUserPosts(profile[0].$id),
                                        profile: profile[0],
                                        objects: {
                                            followers: DataService.getUserObjectFollowers(profile[0].$id),
                                            following: DataService.getUserObjectFollowing(profile[0].$id),
                                            posts: DataService.getUserObjectPosts(profile[0].$id)
                                        }
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
                    templateUrl: 'src/users/userFollow.html',
                    controller: 'UserFollowController as UF',
                    resolve: {
                        friends: function (person, DataService) {
                            var friends = person.objects.followers;
                            angular.forEach(friends, function(friend, index){
                                friends[index] = DataService.getUser(friend.$id);
                            });
                            return friends;
                        }
                    }
                })
                .state('user.profile.following', {
                    url: '/following',
                    templateUrl: 'src/users/userFollow.html',
                    controller: 'UserFollowController as UF',
                    resolve: {
                        friends: function (person, DataService) {
                            var friends = person.objects.following;
                            angular.forEach(friends, function(friend, index){
                                friends[index] = DataService.getUser(friend.$id);
                            });
                            return friends;
                        }
                    }
                })
        });
})();