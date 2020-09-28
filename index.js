const main = document.querySelector("main")
document.addEventListener("DOMContentLoaded", e =>{
    clickHandler();
    uploadPhotoLook();
    submitHandler();
    // loginForm();
})


submitHandler = () => document.addEventListener("submit", e =>{
    e.preventDefault();
    if (e.target.classList.contains(".upload-form")){
        let x = document.getElementById("upload-file").required
        if (x){
        uploadPhoto(e.target)}
    }else if(e.target.classList.contains(".login-form")){
        login(e.target.username.value)
    }else if (e.target.classList.contains("edit-photo")){
        editPhoto(e.target)
    }
})

function editPhoto(photo){
    let name = photo.name.value
    let caption = photo.caption.value
    let date = photo.date.value
    let longitude = photo.longitude.value
    let latitude = photo.latitude.value
    let photoId = parseInt(photo.dataset.id)
    let configObj = {
        method: "PATCH",
        headers: {"content-type": "application/json",
        "accepts": "application/json"},
        body: JSON.stringify({name, caption, date, longitude, latitude})
    }
    fetch(`http://localhost:3000/photos/${photoId}`, configObj)
    .then(resp => resp.json())
    .then(console.log)

    console.log(photo)

}
function uploadPhotoLook(){
    main.innerHTML=`
    <img src="assets/photoguy.png" align="right" alt="Photo Guy" width="600"
        height="600">

        <div class="take">
            <br />
            Take a
        </div>
        <br />
        <div class="picture">
            Picture
        </div>
        <br />
        <div class="para">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidu
            <br />
        </div>`
        uploadForm();
}

function managePhotoLook(photo){
    main.innerHTML=""
    const photoId = photo.id
    
    const currentPhoto = document.createElement("img")
    currentPhoto.src= photo.image_url
    currentPhoto.style.maxWidth="450px"
    main.append(currentPhoto)
    const form = editPhotoForm();
    main.append(form)
    
    if (photo.longitude && photo.latitude){
        form.longitude.value = photo.longitude;
        form.latitude.value = photo.latitude;
        map(photo.longitude, photo.latitude, photo.image_url, 13)
    }else{
        map(-98.5556199, 39.8097343, photo.image_url, 3)
    }
        
    
    if (photo.edit_date){
        
        form.date.value = photo.edit_date.split(".")[0].slice(0,-3)
        
    }
    form.dataset.id = photoId
}



function editPhotoForm(){
    const form = document.createElement("form")
    form.classList.add("edit-photo")
    const formBody = `
    <label for="photo-name">Name of Photo</label>
    <input type="text" id="photo-name" name="name" value="" required>
    <br>
    <label for="photo-caption">caption of Photo</label>
    <input type="text" id="photo-caption" name="caption" value="" required>
    <br>
    <label for="longitude">Longitude of Photo</label>
    <input type="text" id="longitude" name="longitude" value="" required>
    <br>
    <label for="latitude">Latitude of Photo</label>
    <input type="text" id="latitude" name="latitude" value="" required>
    <div id="map" class="edit-map">
    </div>
    <br>
    <label for="date">Date of Photo</label>
    <input type="datetime-local" id="date" name="date" value="" required>
    <br>
    <input type="submit" class="edited-photo">
    `
    form.innerHTML= formBody
    
    return form
}

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
    const photo = document.createElement("img")
    photo.src = data.image_url
    photo.style.maxWidth = "600px";
    manageButton = document.createElement("button")
    manageButton.classList.add("manage")
    manageButton.textContent = "Manage Photo Details"
    manageButton.dataset.id= data.id
    main.append(photo, manageButton)
}


function getCurrentPhoto(id){
    fetch(`http://localhost:3000/photos/${id}`)
    .then(resp => resp.json())
    .then(photo => managePhotoLook(photo))
}

function clickHandler(){
    document.addEventListener("click", e=>{
        
        if (e.target.classList.contains("manage")){
            getCurrentPhoto(e.target.dataset.id)
        }
    })
}

function loginForm(){
    const form = document.createElement("form")
    form.classList.add(".login-form")
    const formBody = `
        <input type="text" placeholder="username" name="username" required>
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

function uploadForm(){
    const form = document.createElement("form")
    form.classList.add(".upload-form")
    const formBody = `
        
        <input type="file" id="upload-file" name="photograph" required>
        <input type="submit" class="upload-image" required>`
    form.innerHTML=formBody
    main.append(form)
}

map = (longitude, latitude, img, zoom = 13) =>{
    var map = L.map('map').setView([latitude, longitude], zoom);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW1zbW8iLCJhIjoiY2tmbDl5d3ptMHN4cjJydDQ5c2Y0YjY5byJ9.0_1l5ZMWrrlNlIwvaazcwQ', {
        maxZoom: 18,
        id: 'mapbox/streets-v10',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);
    let imageIcon = L.icon({
        shadowUrl: 'marker.png',
        iconUrl: img,

        shadowSize: [38, 95], // size of the shadow
        iconSize: [30, 45], // size of the shadow
        shadowAnchor: [22, 94], // point of the shadow which will correspond to marker's location
        iconAnchor: [18, 85],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    if (zoom != 3){
        let marker = L.marker([latitude, longitude], { icon: imageIcon });
        map.addLayer(marker)}
    function onMapClick(e) {
        if (document.querySelector("#map").classList.contains("edit-map")){
            alert("You clicked the map at " + e.latlng);
            map.eachLayer(layer => {
                if(layer.options.icon){
                    map.removeLayer(layer)
                } })
            let newLat = e.latlng["lat"]
            let newLong = e.latlng["lng"]
            marker = L.marker([newLat, newLong], { icon: imageIcon })
            document.querySelector("#latitude").value = e.latlng["lat"].toFixed(4)
            document.querySelector("#longitude").value = e.latlng["lng"].toFixed(4)
            map.addLayer(marker)

            }
    }


    map.on('dblclick', onMapClick);
}
