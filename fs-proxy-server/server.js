const http = require("http");
const https = require("https");
const querystring = require("querystring");
const url = require("url");

const { Agent } = https;
const serverHost = "10.10.10.203";

const handelError = (_, res) => (e) => {
  const msg = String(e.stack || e);
  if (!res.headersSent) {
    res.writeHead(500, { "content-type": "text/plain" });
  }
  res.end(msg);
}

http.createServer((request, response) => {
  console.log('revice proxy request')
  const { method, headers } = request;
  const { connection, host, referer, ...originHeaders } = headers;
  let path = "";
  // 格式化 referer request URL
  const requestURL = url.parse(request.url);
  // 格式化 referer
  const RefererURL = url.parse(referer);

  if (RefererURL.hostname === serverHost) {
    // 请求来自 服务内部
    path = requestURL.path;
  } else {
    const query = querystring.parse(requestURL.query);
    const target = query["target"];
    // @ts-ignore
    const targetURL = url.parse(target);
    path = targetURL.path;
  }
  const options = {
    hostname: "github.com",
    port: "443",
    path: path,
    method: method,
    agent: new Agent({ rejectUnauthorized: false }),
    headers: { originHeaders }
  };

  // @ts-ignore
  const proxy = https.request(options, res => {
    res.on("error", handelError(request, response));

    // 3.修改响应头
    const fieldsToRemove = ["x-frame-options", "content-security-policy"];
    Object.keys(res.headers).forEach(field => {
      if (!fieldsToRemove.includes(field.toLocaleLowerCase())) {
        response.setHeader(field, res.headers[field]);
      }
    });

    res.pipe(response, {
      end: true
    });
  });

  request.pipe(proxy, {
    end: true
  });

  proxy.on("error", handelError(request, response));

}).listen(8888, serverHost, () => {
  console.log("server runnng");
})