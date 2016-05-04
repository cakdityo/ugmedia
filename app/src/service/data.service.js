(function () {
    'use strict';

    angular
        .module('app.service')
        .factory('DataService', DataService);

    function DataService($firebaseRef, $firebaseArray, $firebaseObject) {

        var users = {
            getUser: getUser,
            getUserByUsername: getUserByUsername,
            getUsers: getUsers
        };

        return users;

        function getUser(userId) {
            return $firebaseObject($firebaseRef.users.child(userId));
        }

        function getUserByUsername(username) {
            var userID = $firebaseObject($firebaseRef.userIDs.child(username));
            return userID.$loaded().then(function(){
                var user = $firebaseObject($firebaseRef.users.child(userID.$value));
                return user.$loaded();
            });
        }

        function getUsers(filter) {
            var filteredUsers = [];
            if (filter.length > 2) {
                filteredUsers = $firebaseArray($firebaseRef.users.orderByChild('filter').startAt(filter).endAt(filter + '~'));
            }
            return filteredUsers;
        }
    }
})();