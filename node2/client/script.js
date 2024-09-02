const { json } = require("stream/consumers");

async function addUser(event) {
    event.preventDefault();
    console.log('reached here.....');
    let name = document.getElementById('name').value;
    console.log(name);
    let email = document.getElementById('email').value;
    console.log(email);
    let password = document.getElementById('password').value;
    console.log(password);
    let nameError = document.getElementById('nameError');
    let emailError = document.getElementById('emailError');
    let passwordError = document.getElementById('passwordError');


    //validation
    let emailRegx = /^[a-zA-Z0-9-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;

    if (!name) {
        nameError.innerHTML = "name is required";
    } else {
        nameError.innerHTML = "";
    }
    if (!email) {
        emailError.innerHTML = "email is required";
    } else if(!emailRegx.test(email)){
        emailError.innerHTML = "invalid email";
    }else {
        emailError.innerHTML = "";
    }

    if (!password) {
        passwordError.innerHTML = "password is required";
    } else {
        passwordError.innerHTML = "";
    }


    let datas = {
        name,
        email,
        password,
    }
    console.log(datas);

    let json_datas = JSON.stringify(datas);
    console.log(json_datas);

    let responce = await fetch('/submit', {
        method: "POST",
        headers: {
            'content-type': "application/json",
        },
        body: json_datas,
    });
    // console.log(responce);
    // let parsed_responce = await responce.text();
    // console.log(parsed_responce);
    // if(parsed_responce){
    //     alert(parsed_responce);
    //     return
    // } else {
    //     alert('someting went rong');
    // }
}