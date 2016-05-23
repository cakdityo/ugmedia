(function () {
    'use strict';

    angular
        .module('app.service')
        .factory('DataService', DataService);

    function DataService($firebaseRef, $firebaseArray, $firebaseObject) {

        var DataService = {
            addComment: addComment,
            addPost: addPost,
            deletePost: deletePost,
            getPostComments: getPostComments,
            getUser: getUser,
            getUserByUsername: getUserByUsername,
            getUserObjects: getUserObjects,
            getUserPosts: getUserPosts,
            getUsers: getUsers,
            setUserFollower: setUserFollower,
            setUserFollowing: setUserFollowing,
            setUserPost: setUserPost,
            updateUser: updateUser
        };

        return DataService;

        function addComment(comments, comment){
            comments.$add(comment);
        }

        /*
         Set a post authored by a user then reference it on user's post object
         */
        function addPost(posts, post) {
            posts.$add(post).then(function (newPost) {
                setUserPost(post.author, newPost.key(), true);
            });
        }

        /*
         Delete single post from list of posts.
         */
        function deletePost(posts, post) {
            // Delete all objects associated with given post.
            $firebaseRef.postObjects.child(post.$id).set(null);
            posts.$remove(post).then(function () {
                // Delete user's reference to given post.
                setUserPost(post.author, post.$id, null);
            });
        }

        /*
            Get all comments from the given post.
         */
        function getPostComments(postID) {
            var comments = $firebaseArray($firebaseRef.postObjects.child(postID).child('comments'));
            return comments;
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
        function getUserPosts(userID) {
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
        function setUserFollower(userID, authUserID, state) {
            $firebaseRef.userObjects.child(userID + '/followers/' + authUserID).set(state);
        }

        /*
         Set or unset an authenticated user's following object with ID of given user.
         followState param could be true or false.
         */
        function setUserFollowing(authUserID, userID, state) {
            $firebaseRef.userObjects.child(authUserID + '/following/' + userID).set(state);
        }

        /*
         Set user's post object from existing post object
         */
        function setUserPost(userID, postID, state) {
            $firebaseRef.userObjects.child(userID + '/posts/' + postID).set(state);
        }

        /*
         Update a given user.
         */
        function updateUser(user) {
            user.$save();
        }
    }
})();