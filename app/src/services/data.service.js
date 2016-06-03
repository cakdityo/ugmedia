(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('DataService', DataService);

    function DataService($firebaseRef, $firebaseArray, $firebaseObject) {

        var DataService = {
            addComment: addComment,
            setPost: setPost,
            deleteComment: deleteComment,
            deletePost: deletePost,
            getPost: getPost,
            getPostComments: getPostComments,
            getPostLikes: getPostLikes,
            getPostTaggedUsers: getPostTaggedUsers,
            getUser: getUser,
            getUserByUsername: getUserByUsername,
            getUsers: getUsers,
            setPostLike: setPostLike,
            setPostTaggedUser: setPostTaggedUser,
            setUserFeed: setUserFeed,
            setUserFollower: setUserFollower,
            setUserFollowing: setUserFollowing,
            setUserNotification: setUserNotification,
            setUserPost: setUserPost,
            updateUser: updateUser
        };

        return DataService;

        function addComment(comments, comment) {
            comment.createdAt = firebase.database.ServerValue.TIMESTAMP;
            var promise = comments.$add(comment);
            return promise;
        }

        /*
         Set a post authored by a user then reference it on user's post object
         */
        function setPost(post) {
            post.createdAt = firebase.database.ServerValue.TIMESTAMP;
            var newPost = $firebaseRef.posts.push(post);
            return newPost;
        }

        function deleteComment(comments, comment) {
            var promise = comments.$remove(comment);
        }

        function getPost(postID) {
            var post = $firebaseObject($firebaseRef.posts.child(postID));
            return post;
        }

        /*
         Delete single post from list of posts.
         */
        function deletePost(post, followers) {
            setUserFeed(post.author, post.$id, null);
            angular.forEach(followers, function(follower){
                setUserFeed(follower.$id, post.$id, null);
            });
            $firebaseRef.postComments.child(post.$id).set(null);
            $firebaseRef.postLikes.child(post.$id).set(null);
            $firebaseRef.postTaggedUsers.child(post.$id).set(null);
            setUserPost(post.author, post.$id, null);
            $firebaseRef.posts.child(post.$id).set(null);
        }

        /*
         Get all comments from the given post.
         */
        function getPostComments(postID) {
            var ref = $firebaseRef.postComments.child(postID);
            var comments = $firebaseArray(ref);
            return comments;
        }

        function getPostLikes(postID){
            var ref = $firebaseRef.postLikes.child(postID);
            var likes = $firebaseArray(ref);
            return likes;
        }

        function getPostTaggedUsers(postID) {
            var ref = $firebaseRef.postTaggedUsers.child(postID);
            var users = $firebaseArray(ref);
            users.$loaded().then(function () {
                angular.forEach(users, function (user, key) {
                    users[key] = getUser(user.$id);
                });
            });
            return users;
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
            var user = $firebaseObject($firebaseRef.userIDs.child(username));
            return user;
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

        function setPostLike(postID, userID, state) {
            $firebaseRef.postLikes.child(postID).child(userID).set(state);
        }

        function setPostTaggedUser(postID, userID) {
            $firebaseRef.postTaggedUsers.child(postID).child(userID).set(true);
        }

        function setUserFeed(userID, postID, state) {
            $firebaseRef.userFeeds.child(userID).child(postID).set(state);
        }

        /*
         Set or unset a given user's follower object with ID of authenticated user.
         followState param could be true or false.
         */
        function setUserFollower(userID, authUserID, state) {
            $firebaseRef.userFollowers.child(userID).child(authUserID).set(state);
        }

        /*
         Set or unset an authenticated user's following object with ID of given user.
         followState param could be true or false.
         */
        function setUserFollowing(authUserID, userID, state) {
            $firebaseRef.userFollowing.child(authUserID).child(userID).set(state);
        }

        function setUserNotification(userID, notification) {
            notification.createdAt = firebase.database.ServerValue.TIMESTAMP;
            $firebaseRef.userNotifications.child(userID).push().set(notification);
        }

        /*
         Set user's post object from existing post object
         */
        function setUserPost(userID, postID, state) {
            $firebaseRef.userPosts.child(userID).child(postID).set(state);
        }

        /*
         Update a given user.
         */
        function updateUser(user) {
            user.$save();
        }
    }
})();