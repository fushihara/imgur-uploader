const gulp = require('gulp');
const path = require("path");
const fs = require("fs");
const childProcess = require("child_process");
gulp.task("deploy", async (done) => {
  await typescriptをコンパイル();
  await ファイルをコピー();
  done();
});
function ファイルをコピー() {
  return new Promise((resolve, reject) => {
    gulp.src(['./src/*.html'])
      .pipe(gulp.dest("./docs/"))
      .on("finish", () => { resolve(); });
  });
}
function typescriptをコンパイル() {
  return new Promise((resolve, reject) => {
    console.log(`typescriptをコンパイル。`);
    const cp = childProcess.spawn(`node`, [`./node_modules/typescript/bin/tsc`]);
    cp.stderr.on("data", (data) => {
      console.error(data.toString("utf-8"));
    });
    cp.stdout.on("data", (data) => {
      console.log(data.toString("utf-8"));
    })
    cp.on("exit", (code) => {
      if (code !== 0) {
        console.error(`typescriptのコンパイルに失敗しました。`);
        reject();
      } else {
        resolve();
      }
    });
  });
}
