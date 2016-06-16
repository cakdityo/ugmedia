(function(){
    'use strict';

    angular
        .module('app.services')
        .factory('User', User);

    User.$inject = ['$firebaseArray', '$firebaseObject', '$firebaseRef'];

    function User($firebaseArray, $firebaseObject, $firebaseRef){

        var user = $firebaseObject.$extend({
            getFeeds: getFeeds,
            getFollowers: getFollowers,
            getFollowing: getFollowing,
            getNotifications: getNotifications,
            getPosts: getPosts,
            setFollow: setFollow,
            setPost: setPost,
            setUnfollow: setUnfollow
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

        function setFollow(userID){
            $firebaseRef.userFollowers.child(userID).child(this.$id).set(true);
            $firebaseRef.userFollowing.child(this.$id).child(userID).set(true);
        }

        function setPost(postID){
            $firebaseRef.userPosts.child(this.$id).child(postID).set(true);
        }

        function setUnfollow(userID){
            $firebaseRef.userFollowers.child(userID).child(this.$id).set(null);
            $firebaseRef.userFollowing.child(this.$id).child(userID).set(null);
        }

        //===============================================================================
        return {
            getAll: getAll,
            get: get,
            getByUsername: getByUsername,
            setFeed: setFeed,
            setNotification: setNotification
        };

        function getAll() {
            var users = $firebaseArray($firebaseRef.users);
            return users;
        }

        function get(userID){
            var userRef = $firebaseRef.users.child(userID);
            return new user(userRef);
        }

        function getByUsername(username){
            var user = $firebaseObject($firebaseRef.userIDs.child(username));
            return user;
        }

        function setFeed(userID, postID) {
            $firebaseRef.userFeeds.child(userID).child(postID).set(true);
        }

        function setNotification(userID, notification) {
            notification.createdAt = firebase.database.ServerValue.TIMESTAMP;
            $firebaseRef.userNotifications.child(userID).push(notification);
        }
    }

})();