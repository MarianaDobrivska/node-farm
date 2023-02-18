const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplateValues = require("./utils/replaceTemplateValues");

// get HTML templates using sync method
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

// get all info about products
const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

// server logic
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // configure routes using switch case
  switch (pathname) {
    case "/":
    case "/overview":
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      const cardsHtml = dataObj
        .map((el) => replaceTemplateValues(templateCard, el))
        .join("");
      const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
      res.end(output);
      break;

    case "/product":
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      const product = dataObj[query.id];
      const outputProduct = replaceTemplateValues(templateProduct, product);
      res.end(outputProduct);
      break;

    case "/api":
      res.writeHead(200, {
        "Content-type": "application/json",
      });
      res.end(data);
      break;

    default:
      res.writeHead(404, {
        "Content-type": "text/html",
      });
      res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server running on the port 8000");
});
