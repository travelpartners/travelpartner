'use strict'

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var vueify = require('vueify');
var browserSync = require('browser-sync').create();
var merge = require('merge-stream');
var del = require('del');
var browserify = require('browserify');
var babelify = require('babelify');
var fs = require('fs');

/**
 * Build scripts
 */

gulp.task('build:vue', () => {
    const files = {
        "index.js" : "app/client/index.js",
        "site.js": "app/client/app/site/index.js"
    };

    for (let [dest, src] of Object.entries(files)) {
        browserify(src, { debug: true })
            .transform(babelify, { presets: ['env']})
            .transform(vueify)
            .external('vue')
            .bundle()
            .pipe(fs.createWriteStream("public/dist/js/" + dest));
    }

});

gulp.task('build:libs', () => {});

/**
 * Compress scripts
 */

gulp.task('compress', ['build:vue', 'build:libs'], () => {});

/**
 * Build Templates
 */

gulp.task('build:template', () => {
    let index = gulp.src('app/client/index.html').pipe(gulp.dest('public'));
    let templates = gulp.src('app/client/app/**/index.html').pipe(gulp.dest('public'));

    return merge(index, templates);
});

/**
 * Build CSS
 */

gulp.task('build:css', () => {});

/**
 * Dev Server
 */

gulp.task('dev', ['build:vue', 'build:libs', 'build:template'], () => {
    const port = process.env.PORT || 3000;
    console.log('Dev server running. Listening port ' + port);
    nodemon({
        script: 'app/server/server.js',
        ext: 'js',
        ignore: ['gulpfile.js', 'app/client', 'public/']
    })
    browserSync.init(null, { proxy: "localhost:" + port});
    gulp.watch(['app/client/**', '!app/client/*.html', '!app/client/**/*.html'], ['build:vue']);
    gulp.watch(['app/client/index.html', 'app/client/**/index.html'], ['build:template']);
    gulp.watch('public/**', browserSync.reload);
});

/**
 * Clean scripts
 */

gulp.task('clean:vue', () => {});
gulp.task('clean:libs', () => {});
gulp.task('clean:templates', () => {});
gulp.task('clean:css', () => {});
gulp.task('clean:all', () => {});
gulp.task('clean', ['clean:vue', 'clean:libs', 'clean:templates', 'clean:css'], () => {});
