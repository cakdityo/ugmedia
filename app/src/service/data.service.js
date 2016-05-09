(function () {
    'use strict';

    angular
        .module('app.service')
        .factory('DataService', DataService);

    function DataService($firebaseRef, $firebaseArray, $firebaseObject) {

        var users = {
            getUser: getUser,
            getUserByUsername: getUserByUsername,
            getUserObjects: getUserObjects,
            getUsers: getUsers
        };

        return users;

        /*
         Get single user by ID.
         */
        function getUser(userID) {
            var user = $firebaseObject($firebaseRef.users.child(userID));
            return user;
        }

        /*
         Get single user by Username.
         Index has already set to username in Firebase rules.
         Need to invoke it via $firebaseArray then access it by user[0].
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
         Get all registered users.
         Recently used to populate the search user box.
         ==== STILL WRONG === need future attention ===.
         */
        function getUsers() {
            var users = $firebaseArray($firebaseRef.users);
            return users;
        }
    }
})();