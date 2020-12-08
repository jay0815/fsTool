const extract = require('extract-zip')

const folderPath = (name) => `/Users/qiancheng/Desktop/trainingCamp/zip/${name}.zip`;
// const target = "/Users/qiancheng/Desktop/trainingCamp/all-copy/";
const target = "/Users/qiancheng/Desktop/trainingCamp/homework/";
// const list = ["week01", "week02", "week03", "week04", "week05"];
const list = ["week06"];
void function () {
  list.forEach(async (i) => {
    try {
      await extract(folderPath(i), { dir: target })
      console.log('Extraction complete')
    } catch (err) {
      console.error(err)
      // handle any errors
    }
  })

}()