module.exports = function(){
    var app = './app/';
    var assets = app + 'assets/';

    var config = {
        app: app,
        assets: assets,
        alljs: [
            app + 'src/*.js',
            app + 'src/**/*.js',
            './*.js'
        ],
        index: app + 'index.html',
        js: [
            app + 'src/**/*.module.js',
            app + 'src/**/*.js',
            '!' + app + 'src/**/*.spec.js'
        ],
        css : assets + 'styles/*.css',
        sass: assets + 'styles/**/*.scss',
        bower: {
            json: require('./bower.json'),
            directory: app + 'bower_components/',
            ignorePath: '..'
        }
    };

    config.getWiredepDefaultOptions = function(){
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };
    return config;
};
