(function(){
    'use strict';

    angular
        .module('app.user')
        .controller('UserController', UserController);

    UserController.$inject = ['Activity', 'Auth', 'user','users', '$mdToast', '$state'];

    function UserController(Activity, Auth, user, users, $mdToast, $state){
        var vm = this;

        //Initialize the authenticated users data
        Auth.$onAuthStateChanged(function(auth){
            if (!auth) {
                $state.go('auth');
            }
        });

        vm.notifications = [];
        vm.unopened = [];
        vm.user = {};
        vm.user.feeds = user.getFeeds();
        vm.user.followers = user.getFollowers();
        vm.user.following = user.getFollowing();
        vm.user.notifications = user.getNotifications();
        vm.user.posts = user.getPosts();
        vm.user.profile = user;
        vm.users = users;

        vm.user.notifications.$watch(function(snap){
            if (snap.event === 'child_added'){
                var notification = Activity.get(snap.key);
                notification.$loaded().then(function(){
                    if (notification.unopened){
                        vm.unopened.push(notification);
                        var author = notification.getAuthor();
                        var textContent = '';
                        author.$loaded().then(function(){
                            if (notification.comment){
                                textContent = ' commented on your post';
                            } else if (notification.liked){
                                textContent = ' liked your post';
                            } else if (notification.tagged){
                                textContent = ' tagged you on a post';
                            }
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent(author.username + textContent)
                                .position('top right')
                                .hideDelay(3000)
                            );
                        });
                    }
                    vm.notifications.push(notification);
                });
            } else if (snap.event === 'child_removed') {
                vm.unopened = vm.unopened.filter(function(notification){
                    return notification.$id !== snap.key;
                });
                vm.notifications = vm.notifications.filter(function(notification){
                    return notification.$id !== snap.key;
                });
            }
        });

    }
})();