(function () {

    'use strict';

    angular
        .module('app.services')
        .factory('Storage', function () {
            return firebase.storage();
        });

})();