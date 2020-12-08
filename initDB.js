
const fs = require('fs');
const path = require('path');

const folderPath = `/Users/qiancheng/Desktop/trainingCamp/all-copy/`;

const dbPath = path.join(__dirname, "db", "fullIds.json");

const idsList = [];
const getAllFilesId = (dir) => {
  const folders = fs.readdirSync(dir);

  folders.forEach((item) => {
      const nextPath = path.join(dir, item);
      const itemStat = fs.statSync(nextPath);
      if (itemStat.isDirectory()) {
          getAllFilesId(nextPath);  //递归读取文件
      } else {
        if (![".DS_Store", "readme.md"].includes(item)) {
          idsList.push(item);
        }
      }
  });
}

const main = async () => {
  getAllFilesId(folderPath);
  const idSet = new Set(idsList);
  const uniqueIds = [];
  idSet.forEach((i) => uniqueIds.push(i));
  console.log('idsList', idsList.length)
  console.log('idSet', idSet.size)
  console.log('uniqueIds', uniqueIds.length)
  const stream = JSON.stringify(uniqueIds, null, 4);
  fs.writeFileSync(dbPath, stream);
}

main();
