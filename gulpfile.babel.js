// COMMANDS TO SET UP (assumes gulp and node/npm installed globally)
// npm install gulp gulp-ruby-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache gulp-babel del --save-dev
// mkdir assets; cd assets; mkdir sass javascript images; cd sass; touch app.scss; cd ../..;

// ASSETS and destination FOLDER
var assets = 'assets'; // {assets}/sass/app.scss and {assets}/javascript/*.js
var dest = 'public';
var cssFramework = 'assets/vendor/kube/src/kube.scss';
var jsFramework = 'assets/vendor/javascript';



// REQUIRE EVERYTHING
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    babel = require('gulp-babel'),
    template = require('gulp-template');



// SASS. combine, compile to css, autoprefix and minify
gulp.task('styles', function() {
  return sass(assets+'/sass/app.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest(dest+'/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest(dest+'/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// JS. combine, convert to es5 and minify
gulp.task('scripts', function() {
  return gulp.src(assets+'/javascript/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest(dest+'/javascript'))
    .pipe(babel())
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(dest+'/javascript'))
    .pipe(notify({ message: 'Scripts task complete' }));
});



// GULP WATCH
gulp.task('watch', function() {
  gulp.watch(assets+'/sass/*.scss', ['styles']);
  gulp.watch(assets+'/javascript/*.js', ['scripts']);
  // gulp.watch(assets+'/images/**/*', ['images']);

  livereload.listen();
  gulp.watch([assets+'/**']).on('change', livereload.changed);
});


/////////////////////


// Compile css frameworks
gulp.task('css', function() {
  return sass(cssFramework, { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest(dest+'/vendor/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest(dest+'/vendor/css'))
    .pipe(notify({ message: 'CSS framework compile complete' }));
});



// Compile JS framework files
gulp.task('js', function() {
  return gulp.src(jsFramework+'/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest(dest+'/vendor/javascript'))
    .pipe(babel())
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(dest+'/vendor/javascript'))
    .pipe(notify({ message: 'JS framework task complete' }));
});
