var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del');

gulp.task('minifycss', function() {
    return gulp.src('src/*.css') //压缩的文件
        .pipe(gulp.dest('minified/css')) //输出文件夹
        .pipe(minifycss()); //执行压缩
});

gulp.task('minifyjs', function() {
    return gulp.src('src/*.js')
        .pipe(concat('geolocation.js')) //合并所有js到main.js
        .pipe(gulp.dest('minified/js')) //输出main.js到文件夹
        .pipe(rename({
            suffix: '.min'
        })) //rename压缩后的文件名
        .pipe(uglify()) //压缩
        .pipe(gulp.dest('minified/js')); //输出
});

gulp.task('clean', function(cb) {
    del(['minified/css', 'minified/js'], cb)
});

// gulp.task('default', ['clean'], function() {
//     gulp.start('minifycss', 'minifyjs');
// });

gulp.task('default', ['clean', 'minifycss', 'minifyjs'], function() {});