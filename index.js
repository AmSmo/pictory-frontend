const main = document.querySelector("main")
document.addEventListener("DOMContentLoaded", e =>{
    clickHandler();
    buildform(); 
    // loginForm();
})


document.addEventListener("submit", e =>{
    e.preventDefault();
    if (e.target.classList.contains(".upload-form")){
        uploadPhoto(e.target)
    }else if(e.target.classList.contains(".login-form")){
        login(e.target.username.value)
    }
})

function uploadPhoto(form){
    
    const data = new FormData(form)
    


    const configObj = {
        method: "POST",
        headers: { "accepts": "application/json"},
        body: data
    }
    
    fetch("http://localhost:3000/photos", configObj)
    .then(resp => resp.json())
    .then(data =>{
        goToManageScreen(data)
    })
    .catch(console.log)
}

function goToManageScreen(data){
    main.innerHTML=""
    console.log(data)
    const photo = document.createElement("img")
    photo.src = data.image_url
    photo.width = 450
    manageButton = document.createElement("button")
    manageButton.classList.add("manage")
    manageButton.textContent = "Manage Photo Details"
    manageButton.dataset.id= data.id
    main.append(photo, manageButton)
}


function getCurrentPhoto(id){
    fetch(`http://localhost:3000/photos/${id}`)
    .then(resp => resp.json())
    .then(console.log)
}

function clickHandler(){
    document.addEventListener("click", e=>{
        console.log(e.target)
        if (e.target.classList.contains("manage")){
            getCurrentPhoto(e.target.dataset.id)
        }
    })
}
function loginForm(){
    const form = document.createElement("form")
    form.classList.add(".login-form")
    const formBody = `
        <input type="text" placeholder="username" name="username">
        <input type="submit" class="login">`
    form.innerHTML = formBody
    main.append(form)

}

function login(username){
    const configObj={method: "POST",
        headers: {"content-type": "application/json",
        "accepts": "application/json"},
         body: JSON.stringify({username})
    }
    
    fetch("http://localhost:3000/login/", configObj)
    .then(resp => resp.json())
    .then(console.log)
    .catch(console.log)
}

function buildform(){
    const form = document.createElement("form")
    form.classList.add(".upload-form")
    const formBody = `
        <input type="text" placeholder="caption" name="caption">
        <input type="file" name="photograph">
        <input type="submit" class="upload-image">`
    form.innerHTML=formBody
    main.append(form)
}