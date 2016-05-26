(function () {
    'use strict';

    angular
        .module('app.service')
        .factory('DataService', DataService);

    function DataService($firebaseRef, $firebaseArray, $firebaseObject) {

        var DataService = {
            addComment: addComment,
            addPost: addPost,
            deleteComment: deleteComment,
            deletePost: deletePost,
            getPostComments: getPostComments,
            getPostTaggedUsers: getPostTaggedUsers,
            getUser: getUser,
            getUserByUsername: getUserByUsername,
            getUserObjects: getUserObjects,
            getUserObjectFollowers: getUserObjectFollowers,
            getUserObjectFollowing: getUserObjectFollowing,
            getUserObjectPosts: getUserObjectPosts,
            getUserPosts: getUserPosts,
            getUsers: getUsers,
            setPostTaggedUsers: setPostTaggedUsers,
            setUserFollower: setUserFollower,
            setUserFollowing: setUserFollowing,
            setUserMention: setUserMention,
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
        function addPost(posts, post, taggedUsers) {
            posts.$add(post).then(function (newPost) {
                setUserPost(post.author, newPost.key(), true);
                if (taggedUsers.length > 0) {
                    setPostTaggedUsers(post.author, newPost.key(), taggedUsers);
                }
            });
        }

        function deleteComment(comments, comment) {
            comments.$remove(comment);
        }

        /*
         Delete single post from list of posts.
         */
        function deletePost(posts, post) {
            // Delete all objects associated with given post.
            // These have to be deleted first when author property in post data still exist.
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
            var ref = $firebaseRef.postObjects.child(postID).child('comments');
            var comments = $firebaseArray(ref.limitToLast(5));
            return comments;
        }

        function getPostTaggedUsers(postID) {
            var ref = $firebaseRef.postObjects.child(postID).child('taggedUsers');
            var users = $firebaseArray(ref);
            users.$loaded().then(function(){
                angular.forEach(users, function(user, key){
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

        /*
         Get all objects for the given user.
         Followers, Following, Posts.
         */
        function getUserObjects(userID) {
            var objects = {};
            objects.followers = getUserObjectFollowers(userID);
            objects.following = getUserObjectFollowing(userID);
            objects.posts = getUserObjectPosts(userID);
            return objects;
        }

        function getUserObjectFollowers(userID){
            var followers = $firebaseArray($firebaseRef.userObjects.child(userID).child('followers'));
            return followers;
        }

        function getUserObjectFollowing(userID){
            var following = $firebaseArray($firebaseRef.userObjects.child(userID).child('following'));
            return following;
        }

        function getUserObjectPosts(userID){
            var posts = $firebaseArray($firebaseRef.userObjects.child(userID).child('posts'));
            return posts;
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

        function setPostTaggedUsers(userID, postID, users) {
            angular.forEach(users, function(user){
                var mention = {};
                $firebaseRef.postObjects.child(postID).child('taggedUsers').child(user.$id).set(true);
                setUserMention(user.$id, {author: userID, post: postID});
            });
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

        function setUserMention(userID, mention) {
            $firebaseRef.userMentions.child(userID).push().set(mention);
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