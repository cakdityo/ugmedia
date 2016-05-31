(function () {
    'use strict';

    angular
        .module('app.service')
        .factory('DataService', DataService);

    function DataService($firebaseRef, $firebaseArray, $firebaseObject) {

        var DataService = {
            addComment: addComment,
            setPost: setPost,
            deleteComment: deleteComment,
            deletePost: deletePost,
            getPost: getPost,
            getPostComments: getPostComments,
            getPostComment: getPostComment,
            getPostLikes: getPostLikes,
            getPostTaggedUsers: getPostTaggedUsers,
            getUser: getUser,
            getUserByUsername: getUserByUsername,
            getUserObjectFeeds: getUserObjectFeeds,
            getUserObjectFollowers: getUserObjectFollowers,
            getUserObjectFollowing: getUserObjectFollowing,
            getUserObjectNotifications: getUserObjectNotifications,
            getUserObjectPosts: getUserObjectPosts,
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
            comment.createdAt = Firebase.ServerValue.TIMESTAMP;
            var promise = comments.$add(comment);
            return promise;
        }

        /*
         Set a post authored by a user then reference it on user's post object
         */
        function setPost(post) {
            post.createdAt = Firebase.ServerValue.TIMESTAMP;
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
            $firebaseRef.postObjects.child(post.$id).set(null);
            setUserPost(post.author, post.$id, null);
            $firebaseRef.posts.child(post.$id).set(null);
        }

        /*
         Get all comments from the given post.
         */
        function getPostComments(postID) {
            var ref = $firebaseRef.postObjects.child(postID).child('comments');
            var comments = $firebaseArray(ref.limitToLast(5));
            return comments;
        }

        function getPostComment(postID, commentID) {
            var comment = $firebaseObject($firebaseRef.postObjects.child(postID).child('comments').child(commentID));
            return comment;
        }

        function getPostLikes(postID){
            var ref = $firebaseRef.postObjects.child(postID).child('likes');
            var likes = $firebaseArray(ref);
            return likes;
        }

        function getPostTaggedUsers(postID) {
            var ref = $firebaseRef.postObjects.child(postID).child('taggedUsers');
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
            var user = $firebaseArray($firebaseRef.users.orderByChild('username').equalTo(username));
            return user;
        }

        function getUserObjectFeeds(userID) {
            var feeds = $firebaseArray($firebaseRef.userObjects.child(userID).child('feeds'));
            return feeds;
        }

        function getUserObjectFollowers(userID) {
            var followers = $firebaseArray($firebaseRef.userObjects.child(userID).child('followers'));
            return followers;
        }

        function getUserObjectFollowing(userID) {
            var following = $firebaseArray($firebaseRef.userObjects.child(userID).child('following'));
            return following;
        }

        function getUserObjectNotifications(userID) {
            var notifications = $firebaseArray($firebaseRef.userObjects.child(userID).child('notifications'));
            return notifications;
        }

        function getUserObjectPosts(userID) {
            var posts = $firebaseArray($firebaseRef.userObjects.child(userID).child('posts'));
            return posts;
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
            $firebaseRef.postObjects.child(postID).child('likes').child(userID).set(state);
        }


        function setPostTaggedUser(postID, userID) {
            $firebaseRef.postObjects.child(postID).child('taggedUsers').child(userID).set(true);
        }

        function setUserFeed(userID, postID, state) {
            $firebaseRef.userObjects.child(userID).child('feeds').child(postID).set(state);
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

        function setUserNotification(userID, notification) {
            notification.createdAt = Firebase.ServerValue.TIMESTAMP;
            $firebaseRef.userObjects.child(userID).child('notifications').push().set(notification);
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