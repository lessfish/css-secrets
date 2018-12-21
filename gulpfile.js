const gulp = require('gulp')
const codedog = require('./gulp_codedog')
const changed = require('gulp-changed')
const browserSync = require('browser-sync').create()
const shelljs = require('shelljs')

// 全部文件重新编译
gulp.task("compileAll", () => {
  shelljs.exec('node generate_md.js', () => {
    return gulp.src(["./**/*.md", "!README.md"])
      .pipe(codedog())
      .pipe(gulp.dest("./"))
  })
})

// 增量编译
gulp.task("compile", () => {
  return gulp.src("./**/*.md")
    .pipe(changed("./", {  // dest 参数需要和 gulp.dest 中的参数保持一致
      extension: '.html'  // 如果源文件和生成文件的后缀不同，这一行不能忘
    }))
    .pipe(codedog())
    .pipe(gulp.dest("./"))
    .pipe(browserSync.stream()) // reload
})

gulp.task('watch', () => { 
  gulp.watch(['./!(node_modules)/*.md'], ['compile'])
})

gulp.task('server', () => {
  shelljs.exec('node generate_html.js', () => {
    browserSync.init({
      server: {
        baseDir: './'
      }
    })
  })
})

gulp.task('default', ['server', 'watch'])
