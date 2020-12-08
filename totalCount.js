const fs = require('fs');
const path = require('path');
const { move } = require('fs-extra');

const folderPath = `/Users/qiancheng/Desktop/trainingCamp/all-copy/`;

const filesName = new Set();
const dictionary = new Map();

const getAllFilesId = (dir) => {
  const folders = fs.readdirSync(dir);

  folders.forEach(async (file) => {
    const nextPath = path.join(dir, file);
    const itemStat = fs.statSync(nextPath);
    if (itemStat.isDirectory()) {
      getAllFilesId(nextPath);  //递归读取文件
    } else {
      // 87424-G20200447060047-3. 异步编程 | async异步编程-20201027 121350.js
      // const sNo = file.split('-')[1]; // 抓取学号
      // map.set(sNo, file.trim()); // 替换文件名逻辑
      // 按课程区分
      const mainContent = file.split('-')[2];
      if (mainContent) {
        const lesson = mainContent.split('.')[1].trim(); // 获取课程
        if (dictionary.has(lesson)) {
          if (!filesName.has(file)) {
            dictionary.get(lesson).push(file);
            await move(`${dir}/${file}`, `${folderPath}/${mainContent}/${file}`)
            filesName.add(file);
          }
        } else {
          dictionary.set(lesson, [file]);
          // 创建 目录
          fs.mkdirSync(`${folderPath}/${mainContent}`);
          // 移动文件
          await move(`${dir}/${file}`, `${folderPath}/${mainContent}/${file}`)
        }
      }
    }
  });
}

const main = async () => {

  getAllFilesId(folderPath);

  return void 0;
}

main();
