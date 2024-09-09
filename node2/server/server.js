const http = require('http');
const PORT = 3000;
const url = require('url');
const fs = require('fs'); 
const querystring = require('querystring');
const {MongoClient, ObjectId} = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

async function connect(){
    try{
        await client.connect();
        console.log("database connection established...");
    }
    catch(error){
        console.log("error:",error);                  
    }
}
connect();


const server = http.createServer( async(req, res) => {
    let db = client.db("MYusers");
    let collection = db.collection ("users");
    const req_url = req.url;
    console.log("req_url", req_url);

    const parsed_url = url.parse(req_url);
    
    if (parsed_url.pathname === '/hello') {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end("hello world");  
    }
    else if (parsed_url.pathname === '/') {
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(fs.readFileSync("../client/index.html"));
    }
    else if (parsed_url.pathname === '/adduser.html') {
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(fs.readFileSync("../client/adduser.html"));
    }
    else if (parsed_url.pathname === '/getallusers.html') {
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(fs.readFileSync("../client/getallusers.html"));
    }
    else if (parsed_url.pathname === '/getsingleuser.html') {
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(fs.readFileSync("../client/getsingleuser.html"));
    }
    else if (parsed_url.pathname === '/edituser.html') {
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(fs.readFileSync("../client/edituser.html"));
    }
    else if (parsed_url.pathname === '/style.css') {
        res.writeHead(200, {'content-type': 'text/css'});
        res.end(fs.readFileSync("../client/style.css"));
    }
    else if (parsed_url.pathname === '/script.js') {
        res.writeHead(200, {'content-type': 'text/script'});
        res.end(fs.readFileSync("../client/script.js"));
    }
    else if(parsed_url.pathname === "/submit" && req.method === 'POST'){
        console.log("reached here ..");

        let body ='';
        req.on('data',(chunks)=>{
            console.log("chunks:",chunks);
            body += chunks.toString();
        });

        req.on('end',()=>{
            let datas = JSON.parse(body);
            console.log("datas :",datas);

            console.log("name :",datas.name);
            console.log("email :",datas.email);
            console.log("Password :",datas.pass);

    // serverside valiadation here
    let namereg = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
    let emailreg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let passreg = /^.{6,}$/;
    
    if( !datas.name && !datas.email && !datas.pass){
        res.writeHead(400,{'Content-Type':'text/plain'});
        res.end('name, email and password is required!')
    }
        
    if (!datas.name) {
        res.writeHead(400,{'Content-Type':'text/plain'});
        res.end('name is required!');
        return;

    }
    else if (!namereg.test(datas.name)) {
        res.writeHead(400,{'Content-Type':'text/plain'});
        res.end('Invalid name!')
        return;
    }

    if (!datas.email) {
        res.writeHead(400,{'Content-Type':'text/plain'});
        res.end('email is required!');
        return;
    }
    else if (!emailreg.test(datas.email)) {
        res.writeHead(400,{'Content-Type':'text/plain'});
        res.end('Invalid email!')
        return;
    }

    if (!datas.pass) {
        res.writeHead(400,{'Content-Type':'text/plain'});
        res.end('name, email and password is required!');
        return;
    }
    else if(!passreg.test(datas.pass)){
        res.writeHead(400,{'Content-Type':'text/plain'});
        res.end('name, email and password is required!');
        return;
}


       //save to a database
       collection.insertOne({
        name : datas.name,
        email : datas.email,
        password :datas.pass
       })

       .then((message) =>{
        console.log("message",message);
        res.writeHead(201,{'content-Type':'text/plain'});
        res.end("user created succesfully..");
       })

       .catch((error)=>{
        console.log("error:",error);
        res.writeHead(400,{'content-Type':'text/plain'});
        res.end(error.message ? error.message : "user creation failed")
        });

       });

        
    }
    
    else if(parsed_url.pathname === "/submit" && req.method === 'GET'){
        let userDatas = await collection.find().toArray();
    
        console.log("userdatas :",userDatas);
        let json_data = JSON.stringify(userDatas);
    
        res.writeHead(200,{'Content-Type':'text/json'});
        res.end(json_data);

    }
    else if(parsed_url.pathname === '/user' && req.method === 'POST'){
        let body;

        req.on('data',(chunks)=>{
            console.log("chunks:",chunks);
            body = chunks.toString();
        });

        req.on('end',async ()=>{
            let parsed_body =JSON.parse(body);
            console.log("parsed_body:",parsed_body);

            let id = parsed_body.id;
            console.log("id:",id);
            console.log("type of (_id):",typeof(id))

            let _id = new ObjectId(id);
            console.log("_id",_id);
            console.log("typeof(_id):",typeof(_id));

            let userdata = await collection.findOne({_id});
            console.log("userdata:",userdata);

            let json_data = JSON.stringify(userdata);

            res.writeHead(200,{'Content-Type':'text/json'});
            res.end(json_data);


        });

    }

    else if(parsed_url.pathname === '/user' && req.method === 'PUT'){
        let body= '';
        req.on('data',(chunks)=>{
            body = body + chunks.toString();
            console.log("body:",body);
        })

        req.on('end', async ()=>{
            let datas = JSON.parse(body);
            console.log("datas:",datas);
            id = datas.id;
            let name = datas.name;
            let email = datas.email;
            let password = datas.pass;
            

            console.log("id:",id);
            console.log("typeof(id):",typeof(id));

            let _id = new ObjectId (id);
            console.log("_id:",_id);
            console.log("typeof(_id):",typeof(_id));

            let newdata = {name,email,password}

            await collection.updateOne({_id},{$set :newdata})
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end("user updated susccessfully...")

        
        })
    }
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`listening on http://127.0.0.1:${PORT}`);
});
