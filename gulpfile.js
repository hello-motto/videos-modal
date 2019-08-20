const { src, dest, series, parallel } = require('gulp');

function jsMinify() {
    var terser = require('gulp-terser');
    var concat = require('gulp-concat');
    return src('src/videos-modal.js')
        .pipe(terser({
            "output": {
                "comments": /((["'])(?:\\[\s\S]|.)*?\2|\/(?![*\/])(?:\\.|\[(?:\\.|.)\]|.)*?\/)|\/\/.*?$|\/\*[\s\S]*?\*\//gm
            },
            "ecma": 6
        }))
        .pipe(concat('videos-modal.min.js'))
        .pipe(dest('build'));
}

function cssMinify() {
    var minifyCSS = require('gulp-csso');
    var concat = require('gulp-concat');
    return src('css/videos-modal.css')
        .pipe(minifyCSS())
        .pipe(concat('videos-modal.min.css'))
        .pipe(dest('build'));
}

exports.default = series(
    parallel(cssMinify, jsMinify)
);
