const xlsx = require('node-xlsx');

const fs = require('fs');

const mainName = 'week06';

const original = `/Users/qiancheng/Desktop/trainingCamp/homework/${mainName}/${mainName}.xlsx`;

const target = `/Users/qiancheng/Desktop/trainingCamp/homework/${mainName}/钱冠丞助教-${mainName}-练习评语.xlsx`;

const main = async () => {
  
  // 需要表格表格解析时启用

  const sheetList = xlsx.parse(original);

  const finalSheetList = [{
    name: 'merge',
    data: [['文件名', '练习评语', '是否优秀（优秀写1）']]
  }];

  // 对数据进行处理

  sheetList.forEach((sheet) => {

    sheet.data.forEach((row, index) => {
      if (index === 0) {
        return
      }
      finalSheetList[0].data.push(row);
    })

  })

  const buffer = xlsx.build(finalSheetList);

  //将缓存的数据写入到相应的Excel文件下

  fs.writeFileSync(target, buffer);

  return void 0;
}

main();
