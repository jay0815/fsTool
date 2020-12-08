const fs = require('fs');
const path = require('path');
const { copy } = require('fs-extra');

const FULL_FILES_FOLDER = `/Users/qiancheng/Desktop/trainingCamp/all-copy/`;

const RE_COMMIT_FOLDER = `/Users/qiancheng/Desktop/trainingCamp/resubmit`;

const RE_COMMIT_DB = path.join(__dirname, "db", "reCommit.json");

const RE_COMMIT_SET = new Set(
  fs.existsSync(RE_COMMIT_DB) ? JSON.parse(fs.readFileSync(RE_COMMIT_DB)) : []
);

const DIR = new Set();

const findAndCopyExtraFilesToTargetFolder = (dir) => {

  const folders = fs.readdirSync(dir);

  folders.forEach(async (file) => {

    const nextPath = path.join(dir, file);
    const fileStat = fs.statSync(nextPath);

    if (fileStat.isDirectory()) {

      findAndCopyExtraFilesToTargetFolder(nextPath);  //递归读取文件

    } else {

      if(RE_COMMIT_SET.has(file)) {
;
        // 按课程区分
        const LESSON = file.split('-')[2];

        if (LESSON) {

          if (!DIR.has(LESSON)) {
            DIR.add(LESSON);
            // 创建 目录
            fs.mkdirSync(`${RE_COMMIT_FOLDER}/${LESSON}`);
          }

          // 移动文件
          await copy(`${dir}/${file}`, `${RE_COMMIT_FOLDER}/${LESSON}/${file}`);

          RE_COMMIT_SET.delete(file);
        }
      }

    }

  });

}

const main = async () => {

  findAndCopyExtraFilesToTargetFolder(FULL_FILES_FOLDER);

  // const nextReCommitDB = [];

  return void 0;
}

main();
