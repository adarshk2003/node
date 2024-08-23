const http = require('http');
const port = 3000;
const url = require('url');
const fs = require('fs');
const queryString = require('querystring');
const server = http.createServer((req, res) => {
    //get the request  url 
    const req_url = req.url;
    console.log(req_url);

    //parse thr url
    const parse_url = url.parse(req_url);
    console.log(parse_url);
    if (parse_url.pathname === '/') {
        //pass the html file 
        res.writeHead(200, { 'content-type': 'text/html' });
        res.end(fs.readFileSync('../client/index.html'));
    } else if (parse_url.pathname === '/style.css') {
        res.writeHead(200, { 'content-type': 'text/css' });
        res.end(fs.readFileSync('../client/style.css'));
    } else if (parse_url.pathname === '/submit' && req.method === 'POST') {
        console.log('reached ........')
        let body = '';
        req.on('data', (chunks) => {
            console.log(chunks);
            body += chunks.toString();
        });
        req.on('end', () => {
            console.log(body);
            let datas = queryString.parse(body);
            console.log(datas);
        });
    } else if (parse_url.pathname === '/json') {
        res.writeHead(200, { 'content-type': 'text/json' });
        res.end(fs.readFileSync('../client/datas.json'));
    }
});
server.listen(port, () => {
    console.log(`server is running in http://localhost:${port}`);
});