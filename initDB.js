
const fs = require('fs');
const path = require('path');

const folderPath = `/Users/qiancheng/Desktop/trainingCamp/homework/`;

const idsDB = "ids.json";

const idsList = [];

const getAllFilesId = (dir) => {
  const folders = fs.readdirSync(dir);

  folders.forEach((item) => {
      const nextPath = path.join(dir, item);
      const itemStat = fs.statSync(nextPath);
      if (itemStat.isDirectory()) {
          getAllFilesId(nextPath);  //递归读取文件
      } else {
          const id = item.split('-')[0]; //获取文件唯一id
          // record id
          if(!isNaN(+id)) {
            idsList.push(id);
          }
      }
  });

}

const main = async () => {
  getAllFilesId(folderPath);
  const stream = JSON.stringify(idsList);
  fs.writeFileSync(idsDB, stream);
}

main();
