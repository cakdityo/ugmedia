(function () {
    'use strict';

    angular
        .module('app')
        .constant('FirebaseUrl', 'https://ug-media.firebaseio.com/')
        .config(function ($firebaseRefProvider, FirebaseUrl, $stateProvider, $locationProvider, $mdThemingProvider) {

            var config = {
                apiKey: 'AIzaSyBad5b5cAI6AJb6B3EtkW9DN0JIC4CZ08Q',
                authDomain: 'ug-media.firebaseapp.com',
                databaseURL: 'https://ug-media.firebaseio.com',
                storageBucket: 'ug-media.appspot.com'
            };
            firebase.initializeApp(config);

            //$locationProvider.html5Mode(true);

            $firebaseRefProvider.registerUrl({
                default: FirebaseUrl,
                activities: FirebaseUrl + 'activities',
                posts: FirebaseUrl + 'posts',
                postComments: FirebaseUrl + 'post-comments',
                postLikes: FirebaseUrl + 'post-likes',
                postTaggedUsers: FirebaseUrl + 'post-tagged-users',
                search: FirebaseUrl + 'search',
                userFeeds: FirebaseUrl + 'user-feeds',
                userFollowers: FirebaseUrl + 'user-followers',
                userFollowing: FirebaseUrl + 'user-following',
                userNotifications: FirebaseUrl + 'user-notifications',
                userPosts: FirebaseUrl + 'user-posts',
                userIDs: FirebaseUrl + 'userIDs',
                users: FirebaseUrl + 'users'
            });

            $mdThemingProvider.theme('default')
                .primaryPalette('deep-purple');

            $stateProvider
                .state('auth', {
                    url: '/',
                    templateUrl: 'src/auth/auth.html',
                    controller: 'AuthController as ac',
                    resolve: {
                        requireNoAuth: function (Auth, $state) {
                            return Auth.$requireSignIn().then(function (auth) {
                                $state.go('user');
                            }, function (error) {
                                return;
                            });
                        }
                    }
                })
                .state('user', {
                    url: '/',
                    templateUrl: 'src/users/user.html',
                    controller: 'UserController as U',
                    resolve: {
                        users: function (User) {
                            return User.getAll();
                        },
                        user: function (Auth, User, $state) {
                            return Auth.$requireSignIn()
                                .then(function (auth) {
                                    return User.get(auth.uid)
                                }).catch(function () {
                                    $state.go('auth');
                                });
                        }
                    }
                })
                .state('user.post', {
                    url: 'p/{postID}',
                    templateUrl: 'src/users/userPost.html',
                    controller: 'UserPostController as UPO',
                    resolve: {
                        post: function ($stateParams, Post) {
                            return Post.get($stateParams.postID);
                        }
                    }
                })
                .state('user.setting', {
                    url: 's/{username}',
                    templateUrl: 'src/users/userSetting.html',
                    controller: 'UserSettingController as US',
                    onEnter: function (user, $stateParams, $state) {
                        if (user.username !== $stateParams.username) {
                            $state.go('user');
                        }
                    }
                })
                .state('user.profile', {
                    url: '{username}',
                    templateUrl: 'src/users/userProfile.html',
                    controller: 'UserProfileController as UP',
                    resolve: {
                        person: function (User, user, $stateParams) {
                            if (user.username !== $stateParams.username) {
                                var person = User.getByUsername($stateParams.username);
                                return person.$loaded().then(function(){
                                    return User.get(person.$value);
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
                        friends: function (person) {
                            return person.getFollowers();
                        }
                    }
                })
                .state('user.profile.following', {
                    url: '/following',
                    templateUrl: 'src/users/userFollow.html',
                    controller: 'UserFollowController as UF',
                    resolve: {
                        friends: function (person) {
                            return person.getFollowing();
                        }
                    }
                });
        });
})();