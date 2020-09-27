const main = document.querySelector("main")
document.addEventListener("DOMContentLoaded", e =>{
    clickHandler();
    buildform(); 
    map();
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

map = () =>{
    var map = L.map('map').setView([40.727063, -74.096523], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW1zbW8iLCJhIjoiY2tmbDl5d3ptMHN4cjJydDQ5c2Y0YjY5byJ9.0_1l5ZMWrrlNlIwvaazcwQ', {
        maxZoom: 18,
        id: 'mapbox/streets-v10',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);
    var greenIcon = L.icon({
        shadowUrl: 'marker.png',
        iconUrl: 'test.jpg',

        shadowSize: [38, 95], // size of the shadow
        iconSize: [30, 45], // size of the shadow
        shadowAnchor: [22, 94], // point of the shadow which will correspond to marker's location
        iconAnchor: [18, 85],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    var marker = L.marker([40.727063, -74.096523], { icon: greenIcon }).addTo(map);
    function onMapClick(e) {
        alert("You clicked the map at " + e.latlng);
    }


    map.on('click', onMapClick);
}
