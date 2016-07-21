(function () {

    'use strict';

    angular
        .module('app.services')
        .factory('Post', Post);

    Post.$inject = ['User', '$firebaseArray', '$firebaseObject', '$firebaseRef'];

    function Post(User, $firebaseArray, $firebaseObject, $firebaseRef) {

        var post = $firebaseObject.$extend({
            destroy: destroy,
            getAuthor: getAuthor,
            getComments: getComments,
            getLikes: getLikes,
            getTaggedUsers: getTaggedUsers,
            setLike: setLike,
            setUnlike: setUnlike
        });

        function destroy(authorFollowers) {
            var post = this;
            var postID = post.$id; //fixing undefined value that comes after post has been deleted
            var postAuthor = post.author; //fixing undefined value that comes after post has been deleted
            var activities = $firebaseArray($firebaseRef.activities.orderByChild('post').equalTo(post.$id));
            activities.$loaded().then(function(){
                angular.forEach(activities, function(activity){
                    var activityID = activity.$id;
                    if (activity.tagged) {
                        var users = $firebaseArray($firebaseRef.postTaggedUsers.child(postID));
                        users.$loaded().then(function(){
                            angular.forEach(users, function(user){
                                $firebaseRef.userNotifications.child(user.$id).child(activityID).set(null);
                            });
                            activities.$remove(activity);
                        });
                    } else {
                        $firebaseRef.userNotifications.child(postAuthor).child(activityID).set(null);
                        activities.$remove(activity);
                    }
                });
            });
            $firebaseRef.userFeeds.child(post.author).child(post.$id).set(null);
            angular.forEach(authorFollowers, function(follower){
                $firebaseRef.userFeeds.child(follower.$id).child(post.$id).set(null);
            });
            $firebaseRef.userPosts.child(post.author).child(post.$id).set(null);
            $firebaseRef.postComments.child(post.$id).set(null);
            $firebaseRef.postLikes.child(post.$id).set(null);
            $firebaseRef.postTaggedUsers.child(post.$id).set(null);
            $firebaseRef.posts.child(post.$id).set(null);
        }

        function getAuthor() {
            var author = User.get(this.author);
            return author;
        }

        function getComments() {
            var ref = $firebaseRef.postComments.child(this.$id);
            var comments = $firebaseArray(ref);
            return comments;
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

        function setLike(userID, activityID) {
            $firebaseRef.postLikes.child(this.$id).child(userID).set(activityID);
        }

        function setUnlike(userID) {
            $firebaseRef.postLikes.child(this.$id).child(userID).set(null);
        }

        return {
            get: get,
            push: push,
            set: set,
            setTaggedUser: setTaggedUser
        };

        function get(postID) {
            var postRef = $firebaseRef.posts.child(postID);
            return new post(postRef);
        }

        function push() {
            return $firebaseRef.posts.push();
        }

        function set(key, post) {
            post.createdAt = firebase.database.ServerValue.TIMESTAMP;
            $firebaseRef.posts.child(key).set(post);
        }

        function setTaggedUser(postID, userID, activityID) {
            $firebaseRef.postTaggedUsers.child(postID).child(userID).set(activityID);
        }
    }
})();