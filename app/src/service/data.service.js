(function () {
    'use strict';

    angular
        .module('app.service')
        .factory('DataService', DataService);

    function DataService($firebaseRef, $firebaseArray, $firebaseObject) {

        var users = {
            getUser: getUser,
            getUserByUsername: getUserByUsername,
            getUsers: getUsers,
            getUserObjects: getUserObjects
        };

        return users;

        function getUser(userID) {
            var user = $firebaseObject($firebaseRef.users.child(userID));
            return user;
        }

        function getUserByUsername(username) {
            var user = $firebaseArray($firebaseRef.users.orderByChild('username').equalTo(username));
            return user;
        }

        function getUsers() {
            var users = $firebaseArray($firebaseRef.users);
            return users;
        }

        function getUserObjects(userID){
            var userObjects = $firebaseObject($firebaseRef.userObjects.child(userID));
            return userObjects;
        }
    }
})();