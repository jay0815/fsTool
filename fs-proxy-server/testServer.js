const http = require("http");
const https = require("https");
const url = require("url");
const querystring = require("querystring");

const serverHost = "10.10.10.203";

const server = http.createServer();

server.on("request", (req, res) => {
  const { method, headers } = req;
  const { connection, host, referer, ...originHeaders } = headers;
  let path ="";
  // 格式化 referer request URL
  const requestURL = url.parse(req.url);
  // 格式化 referer
  const RefererURL = url.parse(referer);

  if (RefererURL.hostname === serverHost) {
    // 请求来自 服务内部
    path = requestURL.path;
  }else {
    // 请求来自 客户端
    const query = querystring.parse(requestURL.query);
    const target = query["target"];
    // @ts-ignore
    const targetURL = url.parse(target);
    console.log("TargetURL", targetURL)
    path = targetURL.path;
  }

  const options = {
    "method": method,
    "hostname": "github.com",
    "port": "443",
    "path": path,
    "headers": { originHeaders }
  }
  //接收客户端发送的数据
  const proxy = new Promise((resolve, reject) => {
    let postbody = [];
    req.on("data", chunk => {
      postbody.push(chunk);
    })
    req.on('end', () => {
      let postbodyBuffer = Buffer.concat(postbody);
      resolve(postbodyBuffer)
    })
  });
  //将数据转发，并接收目标服务器返回的数据，然后转发给客户端
  proxy.then((postbodyBuffer) => {
    let responsebody = []
    const request = https.request(options, (response) => {
      response.on("error", (e) => {
        console.log('error', e);
      })
      response.on('data', (chunk) => {
        responsebody.push(chunk)
      })
      response.on("end", () => {
        let responsebodyBuffer = Buffer.concat(responsebody)
        res.end(responsebodyBuffer);
      })
    })
    request.write(postbodyBuffer)
    request.end();
  })
});

server.listen(8888, serverHost, () => {
  console.log("runnng");
})