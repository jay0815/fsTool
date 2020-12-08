const xlsx = require('node-xlsx');

const fs = require('fs');
const path = require('path');

const original = (name) => `/Users/qiancheng/Desktop/trainingCamp/zip/allweek/${name}.xlsx`;

const target = `/Users/qiancheng/Desktop/trainingCamp/zip/allweek/all.xlsx`;

const reCommitDB = path.join(__dirname, "db", "reCommit.json");

const idDB = path.join(__dirname, "db", "fullIds.json");

const main = async () => {


  const finalSheetList = [{
    name: 'merge',
    data: []
  }];
  const set = new Set();
  const duplicates = [];
  ["week01", "week02", "week03", "week04", "week05"].forEach((name) => {
    const sheetList = xlsx.parse(original(name));

    // 对数据进行处理

    sheetList.forEach((sheet) => {

      sheet.data.forEach((row, index) => {
        if (index === 0) {
          return
        }
        finalSheetList[0].data.push(row);
        // @ts-ignore
        const [ fileName ] = row;
        if (set.has(fileName)) {
          duplicates.push(fileName)
        }else {
          // @ts-ignore
          set.add(fileName);
        }
      })

    })

  })

  const dbPath = path.join(__dirname, "db", "fullIds.json");

  // @ts-ignore
  const allFilesName = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : [];

  const reCommit = [];
  allFilesName.forEach(i => {
    if (!set.has(i)) {
      reCommit.push(i)
    }
  });

  console.log('reCommit files size-----', reCommit.length)
  console.log('reCommit files -----', reCommit)
  console.log("all files'name size -----", allFilesName.length)
  console.log('duplicate files size -----', duplicates.length)
  console.log('duplicates files -----', duplicates)
  console.log('has checked files -----', finalSheetList[0].data.length)

  // 按照 文件唯一 id 升序排序
  finalSheetList[0].data.sort((a,b) => {
    const [ida] = a[0].split('-');
    const [idb] = b[0].split('-');
    return (+ida) - (+idb)
  })

  finalSheetList[0].data.unshift(['文件名', '练习评语', '是否优秀（优秀写1）']);
  //将缓存的数据写入到相应的 Excel文件下
  const buffer = xlsx.build(finalSheetList);

  // @ts-ignore
  fs.writeFileSync(target, buffer);

  const list = [];
  set.forEach((i) => list.push(i));
  fs.writeFileSync(idDB, JSON.stringify(list, null, 4));

  // 生成 reCommit 记录
  fs.writeFileSync(reCommitDB, JSON.stringify(reCommit, null, 4));

  return void 0;
}

main();
