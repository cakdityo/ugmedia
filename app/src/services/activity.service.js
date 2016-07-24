(function () {

    'use strict';

    angular
        .module('app.services')
        .factory('Activity', Activity);

    Activity.$inject = ['Post', 'User', '$firebaseArray', '$firebaseObject', '$firebaseRef'];

    function Activity(Post, User, $firebaseArray, $firebaseObject, $firebaseRef) {

        var activity = $firebaseObject.$extend({
            destroy: destroy,
            getAuthor: getAuthor,
            getPost: getPost
        });

        function destroy(receiverIDs) {
            var activity = this;
            if (receiverIDs.length > 0) {
                angular.forEach(receiverIDs, function (receiverID) {
                    $firebaseRef.userNotifications.child(receiverID).child(activity.$id).set(null);
                });
            }
            $firebaseRef.activities.child(activity.$id).set(null);
        }

        function getAuthor() {
            var author = User.get(this.author);
            return author;
        }

        function getPost() {
            var post = Post.get(this.post);
            return post;
        }

        return {
            get: get,
            set: set
        };

        function get(activityID) {
            var activityRef = $firebaseRef.activities.child(activityID);
            return new activity(activityRef);
        }

        //receivers is array
        function set(activity, receivers) {
            activity.unopened = true;
            activity.createdAt = firebase.database.ServerValue.TIMESTAMP;
            var newActivity = $firebaseRef.activities.push(activity);
            if (receivers) {
                angular.forEach(receivers, function (receiver) {
                    if (receiver.$id !== activity.author) {
                        $firebaseRef.userNotifications.child(receiver.$id).child(newActivity.key).set(true);
                    }
                });
            }
            return newActivity;
        }

    }
})();