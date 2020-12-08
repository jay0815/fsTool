const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require('path');
const { move, removeSync } = require('fs-extra');

const DB = "fullIds.json";

const mainName = 'week06';

const folderPath = `/Users/qiancheng/Desktop/trainingCamp/homework/${mainName}/`;

const original = `/Users/qiancheng/Desktop/trainingCamp/homework/${mainName}/${mainName}.xlsx`;

// const target = '/Users/qiancheng/Desktop/训练营作业/week01/钱冠丞助教-week 01-练习评语.xlsx';

const main =  async () => {
  // 获取历史 文件 id’s
  const dbPath = path.join(__dirname, "db", DB);

  const filesNamsList = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : [];

  let existFilesName = new Set(filesNamsList);

  const unCheckFiles = [];

  // 读取当前folder路径
  const files = fs.readdirSync(folderPath);

  const dictionary = new Map();

  files.forEach(async (file) => {
    // 87424-G20200447060047-3. 异步编程 | async异步编程-20201027 121350.js
    // const sNo = file.split('-')[1]; // 抓取学号
    // map.set(sNo, file.trim()); // 替换文件名逻辑
    // 按课程区分
    const mainContent = file.split('-')[2];
    if (mainContent) {
      if(existFilesName.has(file)) {
        // 移除重复文件
        removeSync(`${folderPath}/${file}`);
      }else {
        unCheckFiles.push(file);

        const lesson = mainContent.split('.')[1].trim(); // 获取课程
        // filesNamsList.push(file); // 记录新的文件id
        if (dictionary.has(lesson)) {
          dictionary.get(lesson).push(file);
          await move(`${folderPath}/${file}`, `${folderPath}/${mainContent}/${file}`)
        } else {
          dictionary.set(lesson, [file]);
          // 创建 目录
          fs.mkdirSync(`${folderPath}/${mainContent}`);
          // 移动文件
          await move(`${folderPath}/${file}`, `${folderPath}/${mainContent}/${file}`)
        }
      }
    }
  })

  // SheetList constructor
  // type SheetList = Array<Sheet>
  // Sheet constructor
  // interface Sheet {
  //   name: String; // sheet name
  //   data: Array<Row> // 行数据
  // }
  // Row constructor
  // type Row = Array<Column>
  // Column constructor
  // type Column = String | Number | undefined | null
  const sheetList = [];
  dictionary.forEach((files, lesson) => {
    const sheet = {
      name: lesson
    };
    // init sheet data
    sheet.data = [['文件名', '练习评语', '是否优秀（优秀写1）']];

    files.forEach((i) => {
      sheet.data.push([i])
    });

    sheetList.push(sheet);
  });

  const buffer = xlsx.build(sheetList);

  //将缓存的数据写入到相应的Excel文件下

  fs.writeFileSync(original, buffer);

  // 更新 ids 数据
  const idsSet = new Set(unCheckFiles);
  const ids = [];
  idsSet.forEach((i) => ids.push(i));
  const data = JSON.stringify(ids);

  const unCheckFilesDB = path.join(__dirname, "db", "unCheckFiles.json");

  fs.writeFileSync(unCheckFilesDB, data);

  return void 0;
}

main();
