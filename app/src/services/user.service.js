(function(){
    'use strict';

    angular
        .module('app.services')
        .factory('User', User);

    function User($firebaseRef, $firebaseObject, $firebaseArray){

        var user = $firebaseObject.$extend({
            getFeeds: getFeeds,
            getFollowers: getFollowers,
            getFollowing: getFollowing,
            getNotifications: getNotifications,
            getPosts: getPosts
        });

        //Public function================================================================
        function getFeeds(){
            var ref = $firebaseRef.userFeeds.child(this.$id);
            var feeds = $firebaseArray(ref);
            return feeds;
        }

        function getFollowers(){
            var ref = $firebaseRef.userFollowers.child(this.$id);
            var followers = $firebaseArray(ref);
            return followers;
        }

        function getFollowing(){
            var ref = $firebaseRef.userFollowing.child(this.$id);
            var following = $firebaseArray(ref);
            return following;
        }

        function getNotifications(){
            var ref = $firebaseRef.userNotifications.child(this.$id);
            var notifications = $firebaseArray(ref);
            return notifications;
        }

        function getPosts(){
            var ref = $firebaseRef.userPosts.child(this.$id);
            var posts = $firebaseArray(ref);
            return posts;
        }

        return function(userID){
            var userRef = $firebaseRef.users.child(userID);
            return new user(userRef);
        };
    }

})();