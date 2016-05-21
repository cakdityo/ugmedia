(function () {
    'use strict';

    angular
        .module('app.service')
        .factory('DataService', DataService);

    function DataService($firebaseRef, $firebaseArray, $firebaseObject) {

        var DataService = {
            deletePost: deletePost,
            getUser: getUser,
            getUserByUsername: getUserByUsername,
            getUserObjects: getUserObjects,
            getUserPosts: getUserPosts,
            getUsers: getUsers,
            setFollower: setFollower,
            setFollowing: setFollowing,
            setPost: setPost,
            setUserPost: setUserPost,
            updateUser: updateUser
        };

        return DataService;

        /*
            Delete single post from list of posts.
         */
        function deletePost(posts, post){
            posts.$remove(post).then(function(){
                $firebaseRef.userObjects.child(post.author).child('posts').child(post.$id).set(null);
            });
        }

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
         Get all objects for the given user.
         Followers, Following, Posts.
         */
        function getUserObjects(userID) {
            var userObjects = $firebaseObject($firebaseRef.userObjects.child(userID));
            return userObjects;
        }

        /*
            Get all posts for the given user.
         */
        function getUserPosts(userID){
            var userPosts = $firebaseArray($firebaseRef.posts.orderByChild('author').equalTo(userID));
            return userPosts;
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
        function setPost(posts, post){
            posts.$add(post).then(function(newPost){
                setUserPost(post.author, newPost.key());
            });
        }

        /*
         Set user's post object from existing post object
         */
        function setUserPost(userID, postID){
            $firebaseRef.userObjects.child(userID + '/posts/' + postID).set(true);
        }

        /*
         Update a given user.
         */
        function updateUser(user){
            user.$save();
        }
    }
})();