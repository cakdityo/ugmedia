(function(){
   'use strict';

    angular
        .module('app',[

            //Bower dependencies
            'ui.router',
            'ngMaterial',
            'firebase',
            'ngFileUpload',
            'ngImgCrop',
            'angularMoment',

            //App dependencies
            'app.auth',
            'app.component',
            'app.layout',
            'app.services',
            'app.user'
        ]);
})();