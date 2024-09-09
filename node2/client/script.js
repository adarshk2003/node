async function adduser(event) {
    event.preventDefault();
    console.log("reached here...");

    let name = document.getElementById("name").value;
    console.log("name:", name);

    let email = document.getElementById("email").value;
    console.log("email:", email);

    let pass = document.getElementById("pass").value;
    console.log("password:", pass);

   
    let nameerr = document.getElementById("name-err");
    let emailerr = document.getElementById("email-err");
    let passerr = document.getElementById("pass-err");


    let namereg = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
    let emailreg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let passreg = /^.{6,}$/;
    
    nameerr.innerHTML = '';
    emailerr.innerHTML = '';
    passerr.innerHTML = '';

    // validation at client side
    if( !name && !email && !pass){
        nameerr.innerHTML = "name is required!";
        emailerr.innerHTML = "email is required!";
        passerr.innerHTML = "password is required!"
    }
        
    if (!name) {
        nameerr.innerHTML = "name is required!";
        return;

    }
    else if (!namereg.test(name)) {
        nameerr.innerHTML = "invalid name!"
        return;


    }

    if (!email) {
        emailerr.innerHTML = 'email is required!';
        return;
    }
    else if (!emailreg.test(email)) {
        emailerr.innerHTML = "invalid email!";
        return;
    }

    if (!pass) {
        passerr.innerHTML = 'password required!'
        return;
    }
    else if(!passreg.test(pass)){
    passerr.innerHTML = "password must contain 6 characters!"
    return;
}





    let datas = {
        name,
        email,
        pass

    };

    console.log("datas:", datas);
    let json_data = JSON.stringify(datas);
    console.log("json_data:", json_data);

    let response = await fetch("/submit", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: json_data
    });
    console.log("response:", response);

    let parsed_response = await response.text();
    console.log("parsed response:", parsed_response);

    if (parsed_response) {
    alert(parsed_response);
        return;
    }
    else {
        alert("something went wrong");
    }

}


let newfetch = fetch("http://127.0.0.1:3000/submit", {
    method: "GET"
})
    .then((response) => {
        console.log("new response:", response);
        return response.json();

    })
    .then((datas) => {
        console.log("datassss", datas);
        let tbody = document.getElementById('tbody');
        let content = '';
        for (i = 0; i < datas.length; i++) {
            content = content + `
            <tr>
            <td class="centercon">${datas[i].name}</td>
            <td class="centercon">${datas[i].email}</td>
            <td class="centercon">${datas[i].password}</td>
            <td><button class="button12" onclick="sendid('${datas[i]._id}')">view</button>
            <tr>`


        }
        tbody.innerHTML = content;
    })
    .catch((error) => {
        console.log(error);
    })



function sendid(id) {
    console.log("button clicked..")
    console.log("id:", id);
    window.location.href = `getsingleuser.html?id=${id}`
}


async function loaddata() {

    let location = window.location;
    console.log("location :", location);

    let querystring = location.search;
    console.log("querystring :", querystring);

    let queryparams = new URLSearchParams(querystring);
    console.log("queryparams :", queryparams);

    let id = queryparams.get("id");
    console.log("id :", id);

    let response = await fetch("http://127.0.0.1:3000/user", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "id": id })
    })
    console.log("response:", response);

    let json_response = await response.json();
    console.log("name:", json_response.name);

    let viewuser = document.getElementById("viewuser");
    let content = `
 <h4>Name : ${json_response.name}
 <h4>Email : ${json_response.email}
 <h4>Password : ${json_response.password}
 <div><button class="button1" id="btn" onclick = 'senduserdata("${json_response._id}")'>Edit Data</button></div>`

    viewuser.innerHTML = content;



}

function senduserdata(id) {
    console.log("editdata button clicked...")
    console.log("id:", id);
    window.location.href = `edituser.html?id=${id}`

}

async function edituser() {
    let location = window.location;
    console.log("location :", location);

    let querystring = location.search;
    console.log("querystring :", querystring);

    let queryparams = new URLSearchParams(querystring);
    console.log("queryparams :", queryparams);

    let id = queryparams.get("id");
    console.log("id :", id);

    let response = await fetch("http://127.0.0.1:3000/user", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "id": id })
    })
    console.log("response:", response);

    let parsed_response = await response.text();
    console.log("parsed response:", parsed_response);
    let json_response = JSON.parse(parsed_response);
    console.log("json_response", json_response);

    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('pass');
    name.value = json_response.name;
    email.value = json_response.email;
    password.value = json_response.password;


}


async function updateuser(event){
    event.preventDefault();
    console.log("reached here...");

    let location = window.location;
    console.log("location :", location);

    let querystring = location.search;
    console.log("querystring :", querystring);

    let queryparams = new URLSearchParams(querystring);
    console.log("queryparams :", queryparams);

    let id = queryparams.get("id");
    console.log("id :", id);

    let name = document.getElementById("name").value;
    console.log("name:", name);

    let email = document.getElementById("email").value;
    console.log("email:", email);

    let pass = document.getElementById("pass").value;
    console.log("password:", pass);

    
    let nameerr = document.getElementById("name-err");
    let emailerr = document.getElementById("email-err");
    let passerr = document.getElementById("pass-err");


    let namereg = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
    let emailreg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let passreg = /^.{6,}$/;
    
    nameerr.innerHTML = '';
    emailerr.innerHTML = '';
    passerr.innerHTML = '';

    // validation at client side
    if( !name && !email && !pass){
        nameerr.innerHTML = "name is required!";
        emailerr.innerHTML = "email is required!";
        passerr.innerHTML = "password is required!"
    }
        
    if (!name) {
        nameerr.innerHTML = "name is required!";
        return;

    }
    else if (!namereg.test(name)) {
        nameerr.innerHTML = "invalid name!"
        return;


    }

    if (!email) {
        emailerr.innerHTML = 'email is required!';
        return;
    }
    else if (!emailreg.test(email)) {
        emailerr.innerHTML = "invalid email!";
        return;
    }

    if (!pass) {
        passerr.innerHTML = 'password required!'
        return;
    }
    else if(!passreg.test(pass)){
    passerr.innerHTML = "password must contain 6 characters!"
    return;
}


    

    let datas = {
        id,
        name,
        email,
        pass

    };

    console.log("datas:", datas);
    let json_data = JSON.stringify(datas);
    console.log("json_data:", json_data);

    let response = await fetch("http://127.0.0.1:3000/user", {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: json_data
    })
    console.log("response:", response);

    let text_response = await response.text();
    console.log("text_response:",text_response);
    
   if(text_response){
    alert(text_response);
    return;
   }
   else{
    alert('something went wrong');
   }
}

