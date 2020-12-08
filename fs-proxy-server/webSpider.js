const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const file = path.join(__dirname, "../", "db", "github.json");

const url = (id) => `https://github.com/GeekUniversity/Frontend-06-Template/issues/${id}`;

const id = "12";

void async function(){
  const target = url(id);
  console.log('target url', target);
  console.log('file', file);
  const browser = await puppeteer.launch({
    headless: false
  });
  console.log('browser has launched');
  const page = await browser.newPage();
  console.log('new tab page has created');
  try {
    await page.goto(target, {
      timeout: 120000, waitUntil: 'networkidle0'
    });
  }catch(e) {
    console.log(e);
  }
  console.log('before domcontentloaded');
  await page.on('domcontentloaded', () => {});
  console.log('domcontentloaded');
  // todo waiting for all downloaded
  const result = await page.$$eval("td[class='d-block comment-body markdown-body  js-comment-body']", (elements) => {
    const result = [];
    elements.shift();
    elements.forEach((item) => {
      const { children: [{ childNodes }] } = item;
      result.push({
          no: childNodes[0].textContent.split(":")[1].trim(),
          name: childNodes[2].textContent.split(":")[1].trim(),
          url: childNodes[9].text
      });
    })

    //返回导航栏的href和文本内容
    return result;
  })            
  fs.writeFileSync(file, JSON.stringify(result, null, '\t'));

  await browser.close();
}();
