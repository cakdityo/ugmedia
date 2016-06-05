(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('DataService', DataService);

    function DataService($firebaseRef, $firebaseArray, $firebaseObject) {

        var DataService = {
            addComment: addComment,
            deleteComment: deleteComment,
            deletePost: deletePost,
            updateUser: updateUser
        };

        return DataService;

        function addComment(comments, comment) {
            comment.createdAt = firebase.database.ServerValue.TIMESTAMP;
            var promise = comments.$add(comment);
            return promise;
        }

        function deleteComment(comments, comment) {
            var promise = comments.$remove(comment);
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