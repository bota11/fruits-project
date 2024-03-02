import fs from "fs";
import http from "http";
import url from "url";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import replaceTemplate from './modules/replaceTemplate.js';

const __filename = fileURLToPath(import.meta.url);

// Use dirname to get the directory name
const __dirname = dirname(__filename);


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const dataObj = JSON.parse(data);




const server = http.createServer((req,res)=>{
    console.log(req.url);
    // console.log(url.parse(req.url, true));
    // console.log(url.parse(req.url, true));
    const {query, pathname} =url.parse(req.url, true);
   
    //overview page
    if ((pathname === "/") || (pathname === '/overview')){
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML)
        // console.log(cardsHTML);
        res.end(output);

    //product page
    } else if (pathname === "/product") {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output);
        //API
    } else if (pathname === "/api") {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);      
     //not found   
    } else {
        // Headers should be sent before 
        res.writeHead(404, { 
            'Content':'text/html',
            'my-own-header':'hello-world'
        });
        res.end('<h1>Page cannot be found</h1>')
    }
    // res.end("Hello from Server");
});

server.listen(8000, '127.0.0.1', ()=>{
    console.log("listening to request on port 8000")
})
