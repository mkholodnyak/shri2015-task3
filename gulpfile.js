var gulp = require('gulp'),
    path = require('path'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    babelify = require("babelify"),
    sourceStream = require('vinyl-source-stream'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create(),
    liveReload = browserSync.reload;

var config = {
    outPath: 'public/',
    appPath: 'app/',
    htmlSrc: 'index.html'
};

var handleError = function () {
    var args = Array.prototype.slice.call(arguments);

    $.notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);

    this.emit('end');
};

gulp.task('default', ['start-livereload-server', 'build-files']);

gulp.task('build-files', ['html', 'css', 'browserify', 'image', 'font']);

gulp.task('start-livereload-server', function () {
    browserSync.init({
        server: config.outPath
    });

    gulp.watch('*.html', ['html']);
    gulp.watch(config.appPath + '/css/**/*.scss', ['css']);
    gulp.watch(config.appPath + 'fonts/**/*{.eot,.svg,.ttf,.woff}', ['font']);
});


gulp.task('html', function () {
    gulp.src('*.html')
        .pipe($.rename('index.html'))
        .pipe($.minifyHtml())
        .pipe(gulp.dest(config.outPath))
        .pipe(liveReload({stream: true}));
});

gulp.task('css', function () {
    gulp.src(config.appPath + '/css/**/*.scss')
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer())
        .pipe($.minifyCss())
        .pipe(gulp.dest(config.outPath + config.appPath + 'css'))
        .pipe(liveReload({stream: true}));
});

gulp.task('font', function () {
    gulp.src(config.appPath + 'fonts/**/*{.eot,.svg,.ttf,.woff}')
        .pipe(gulp.dest(config.outPath + config.appPath + 'fonts'))
        .pipe(liveReload({stream: true}));
});

gulp.task('image', function () {
    gulp.src(config.appPath + '/images/**/*.{png,svg,jpg,jpeg}')
        .pipe(gulp.dest(config.outPath + config.appPath + 'images'))
        .pipe(liveReload({stream: true}));
});

gulp.task('browserify', function () {
    var srcPath = path.join(__dirname, config.appPath + 'js/');
    var browserifyFiles = function (srcArray) {
        return srcArray.map(function (sourceStr) {
            // Удаляю расширение .js
            var filename = sourceStr.split('/').pop().slice(0, -3);

            console.log(srcPath);
            console.log(filename);
            var bundler = watchify(browserify(sourceStr, {
                debug: true,
                cache: {},
                packageCache: {}
            })
                .transform(babelify));

            function rebundle() {
                bundler.bundle().on('error', handleError)
                    .pipe(sourceStream(filename + ".Bundle.js"))
                    .pipe($.streamify($.uglify().on('error', handleError)))
                    .pipe(gulp.dest(config.outPath + config.appPath + 'js/Bundle'))
                    .pipe(liveReload({stream: true}));
            }

            bundler.on('update', function () {
                console.log('-> bundling...');
                rebundle();
            });
            rebundle();
        });
    };

    var bundleFiles = ['index.js'];
    browserifyFiles(bundleFiles.map(function (filename) {
        return srcPath + filename;
    }));
});