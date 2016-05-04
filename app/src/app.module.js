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

            //App dependencies
            'app.auth',
            'app.layout',
            'app.service',
            'app.user'
        ]);
})();