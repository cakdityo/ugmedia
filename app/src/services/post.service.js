(function () {

    'use strict';

    angular
        .module('app.services')
        .factory('Post', Post);

    Post.$inject = ['User', '$firebaseArray', '$firebaseObject', '$firebaseRef'];

    function Post(User, $firebaseArray, $firebaseObject, $firebaseRef) {

        var post = $firebaseObject.$extend({
            getAuthor: getAuthor,
            getComments: getComments,
            getLikes: getLikes,
            getTaggedUsers: getTaggedUsers,
            setLike: setLike,
            setUnlike: setUnlike
        });

        function getAuthor() {
            var author = User.get(this.author);
            return author;
        }

        function getComments() {
            var ref = $firebaseRef.postComments.child(this.$id);
            var posts = $firebaseArray(ref);
            return posts;
        }

        function getLikes() {
            var ref = $firebaseRef.postLikes.child(this.$id);
            var likes = $firebaseArray(ref);
            return likes;
        }

        function getTaggedUsers() {
            var ref = $firebaseRef.postTaggedUsers.child(this.$id);
            var users = $firebaseArray(ref);
            users.$loaded().then(function(){
                angular.forEach(users, function(user, key){
                    users[key] = User.get(user.$id);
                });
            });
            return users;
        }

        function setLike(userID) {
            $firebaseRef.postLikes.child(this.$id).child(userID).set(true);
        }

        function setUnlike(userID) {
            $firebaseRef.postLikes.child(this.$id).child(userID).set(null);
        }

        return {
            get: get,
            set: set,
            setTaggedUser: setTaggedUser
        };

        function get(postID) {
            var postRef = $firebaseRef.posts.child(postID);
            return new post(postRef);
        }

        function set(post) {
            post.createdAt = firebase.database.ServerValue.TIMESTAMP;
            return $firebaseRef.posts.push(post);
        }

        function setTaggedUser(postID, userID) {
            $firebaseRef.postTaggedUsers.child(postID).child(userID).set(true);
        }
    }
})();