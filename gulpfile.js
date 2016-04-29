var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var args = require('yargs').argv;
var del = require('del');
var config = require('./gulp.config.js')();
var $ = require('gulp-load-plugins')({lazy: true});

//Serving application
gulp.task('serve', function(){
    browserSync({
        server: {
            baseDir: 'app'
        }
    });

    gulp.watch(['*.html', 'assets/styles/*.css', 'src/**/*.js', 'src/**/*.html'], {cwd: 'app'}, reload);
});

// Analyzing source with JSHint and JSCS
gulp.task('vet', function(){
    log('Analyzing source with JSHint and JSCS...');
    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

//Compile Sass to CSS
gulp.task('styles', ['clean-styles'], function(){
    log('Compile Sass --> CSS');
    return gulp
        .src(config.sass)
        .pipe($.plumber())
        .pipe($.sass())
        .pipe($.autoprefixer({browsers: ['Last 2 versions', '> 5%']}))
        .pipe(gulp.dest(config.assets))
        .pipe(reload({stream:true}));
});

//Clean only the styles
gulp.task('clean-styles', function(){
    clean(config.css);
});

gulp.task('wiredep', function(){
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;
    log('Wire up the bower css js and app js into HTML index');
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js, {read: false}), {relative: true}))
        .pipe(gulp.dest(config.app));
});

gulp.task('inject',['wiredep', 'styles'], function(){
    log('Wire up the app css into HTML index');
    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css, {read: false}), {relative: true}))
        .pipe(gulp.dest(config.app));
});

////////////
function clean(path){
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path);
}

function log(msg){
    if(typeof(msg) === 'object'){
        for (var item in msg) {
            if (msg.hasOwnProperty(item)){
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}