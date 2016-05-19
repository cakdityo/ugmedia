(function () {
    'use strict';

    angular
        .module('app.service')
        .factory('DataService', DataService);

    function DataService($firebaseRef, $firebaseArray, $firebaseObject) {

        var data = {
            getUser: getUser,
            getUserByUsername: getUserByUsername,
            getUserObjects: getUserObjects,
            getUsers: getUsers,
            setFollower: setFollower,
            setFollowing: setFollowing,
            setPost: setPost,
            setUserPost: setUserPost
        };

        return data;

        /*
         Get single users by ID.
         */
        function getUser(userID) {
            var user = $firebaseObject($firebaseRef.users.child(userID));
            return user;
        }

        /*
         Get single users by Username.
         Index has already set to username in Firebase rules.
         Need to invoke it via $firebaseArray then access it by users[0].
         */
        function getUserByUsername(username) {
            var user = $firebaseArray($firebaseRef.users.orderByChild('username').equalTo(username));
            return user;
        }

        /*
         Get all objects for the given users.
         Followers, Following, Posts.
         */
        function getUserObjects(userID) {
            var userObjects = $firebaseObject($firebaseRef.userObjects.child(userID));
            return userObjects;
        }

        /*
         Get all registered users.
         Recently used to populate the search users box.
         ==== STILL WRONG === need future attention ===.
         */
        function getUsers() {
            var users = $firebaseArray($firebaseRef.users);
            return users;
        }

        /*
            Set or unset a given user's follower object with ID of authenticated user.
            followState param could be true or false.
         */
        function setFollower(userID, authUserID, followState){
            $firebaseRef.userObjects.child(userID + '/followers/' + authUserID).set(followState);
        }

        /*
            Set or unset an authenticated user's following object with ID of given user.
            followState param could be true or false.
         */
        function setFollowing(authUserID, userID, followState){
            $firebaseRef.userObjects.child(authUserID + '/following/' + userID).set(followState);
        }

        /*
            Set a post authored by a user then reference it on user's post object
         */
        function setPost(post){
            var newPost = $firebaseRef.posts.push();
            newPost.set(post);
            setUserPost(post.author, newPost.key());
        }

        /*
            Set user's post object from existing post object
         */
        function setUserPost(userID, postID){
            $firebaseRef.userObjects.child(userID + '/posts/' + postID).set(true);
        }
    }
})();