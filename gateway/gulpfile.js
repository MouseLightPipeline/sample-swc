var gulp = require("gulp");
var del = require("del");
var nodemon = require("gulp-nodemon");
var plumber = require("gulp-plumber");
var tslint = require("gulp-tslint");
var gulpTypings = require("gulp-typings");
var tsc = require("gulp-typescript");

gulp.task("default", ["develop"]);

gulp.task("build", ["ts"]);

gulp.task("develop", ["nodemon", "watch"]);

gulp.task("nodemon", ["build"], () => {
    nodemon({
        script: "dist/app.js",
        ext: "js",
        stdout: false
    }).on("readable", () => {
        this.stdout.pipe(process.stdout);
        this.stderr.pipe(process.stderr);
    });
});

gulp.task("watch", () => {
    return gulp.watch(["src/**/*.*", "gulpfile.js"], ["build"]);
});

gulp.task("clean", () => {
    return del("dist/**/*");
});

gulp.task("typings", ["clean"], function () {
    return gulp.src("./typings.json").pipe(gulpTypings());
});

gulp.task("tslint", () => {
    gulp.src("src/**/*.ts")
        .pipe(tslint({configuration: "../tslint.json", formatter: "prose"}))
        .pipe(tslint.report({emitError: false}));
});

gulp.task("ts", ["tslint", "typings"], () => {
    var tsConfig = require("./tsconfig.json");

    return gulp.src(["src/**/*.ts", "typings/**/*.d.ts"]).pipe(tsc(tsConfig.compilerOptions)).pipe(gulp.dest("dist/"));
});
