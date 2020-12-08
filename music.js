const fs = require('fs');
const puppeteer = require('puppeteer');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

void async function () {
  // const browser = await puppeteer.launch();

  const browser = await puppeteer.launch({
    args: ['--disable-features=site-per-process', "--unhandled-rejections=strict"],
    headless: false           
  });                                                                                                                                                                                                                                                                        

  const page = await browser.newPage();
  await page.goto('https://y.qq.com/', {
    waitUntil: 'networkidle2'
  });
  await page.on('domcontentloaded', () => { });
  console.log('domcontentloaded');

  await page.frames().map(frame => {
    console.log(frame.url())
  });
  // todo waiting for all downloaded
  await page.waitForSelector('div.header__opt'); 
  console.log("1")
  // // 模拟点击
  const START_LOGIN_BUTTON = await page.$("a.top_login__link.js_login");
  await START_LOGIN_BUTTON.click();
  console.log("2")
  // // 
  await page.waitForSelector('#divdialog_0');
  console.log("3")
  //找到页面所有的iframe并打印出iframe链接，frame.url()获取frame的url
  const topElementHandle = await page.$('iframe.popup_login_qq');
  const TOP_IFRAME = await topElementHandle.contentFrame();
  await TOP_IFRAME.waitForSelector("iframe#ptlogin_iframe"), {
    visible: true
  };
  const secondElementHandle = await TOP_IFRAME.$("iframe#ptlogin_iframe");
  const LOGIN_IFRAME = await secondElementHandle.contentFrame();
  await LOGIN_IFRAME.waitForSelector("a#switcher_plogin", {
    visible: true
  });
  await LOGIN_IFRAME.$eval("a[id=switcher_plogin]",  (e) => {
    e.click();
  })
  
  console.log("4")

  //在定位的iframe页面内操作
  await LOGIN_IFRAME.waitForSelector('input#u.inputstyle', {
    visible: true
  });
  await LOGIN_IFRAME.type('input#u.inputstyle', '543612779', { delay: 20 });
  await LOGIN_IFRAME.waitForSelector('input#p.inputstyle.password', {
    visible: true
  });
  await sleep(5000);
  await LOGIN_IFRAME.type('input#p.inputstyle.password', 'qgc940815jay!!', { delay: 20 });
  console.log("5")

  await LOGIN_IFRAME.$eval('input.btn#login_button', (e) => {
    e.click();
  });

  // LOGIN_BUTTON.click();
  console.log("6")
  await sleep(5000);
  let name = await page.$eval('div.popup_user_data__name', (e) => {
    console.log(e, e.querySelector("a"))
    return e.querySelector("a")[0].innerHTML;
  });
  
  if (name === "κiζsヤ錢灬") {
    console.log(true)
  }else {
    console.log(false)
  }


  // await browser.close();
}();
