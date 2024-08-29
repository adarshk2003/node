const http = require('http');
const port = 3000;
const url = require('url');
const fs = require('fs');
const queryString = require('querystring');
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://127.0.0.1:27017');

async function connect() {
    try {
        await client.connect();
        console.log("Database connection established");
    } catch (error) {
        console.log(error);
    }
}
connect();
const server = http.createServer((req, res) => {
    let db = client.db("dms");
    let collection = db.collection("users");

    // Get the request URL
    const req_url = req.url;
    console.log(req_url);

    // Parse the URL
    const parse_url = url.parse(req_url);
    console.log(parse_url);

    if (parse_url.pathname === '/') {
        // Serve the HTML file
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync('../client/index.html'));
    } else if (parse_url.pathname === '/style.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(fs.readFileSync('../client/style.css'));
    } else if (parse_url.pathname === '/submit' && req.method === 'POST') {
        console.log('reached ........');
        let body = '';
        req.on('data', (chunks) => {
            body += chunks.toString();
        });
        req.on('end', () => {
            console.log(body);
            let datas = queryString.parse(body);
            console.log(datas);
            console.log("name:", datas.name);
            console.log("email:", datas.email);
            console.log("password:", datas.password);

            // Save to DB
            collection.insertOne({
                name: datas.name,
                email: datas.email,
                password: datas.password,
            })
                .then((message) => {
                    console.log(message);
                    res.writeHead(201, { 'Content-Type': "text/plain" });
                    res.end("User created successfully");
                })
                .catch((error) => {
                    console.log(error);
                    res.writeHead(400, { 'Content-Type': "text/plain" });
                    res.end("User creation failed");
                });
        });
    }
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
