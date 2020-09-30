const main = document.querySelector("main")
document.addEventListener("DOMContentLoaded", e =>{
    // clickHandler();
    // uploadPhotoLook();
    // submitHandler();
    loginForm();
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
    .then(data=> {
        renderPossiblePlaces(data)})
}

function renderPossiblePlaces(data){
    console.log(data)
    photo = data.photo
    if (data.found === "none"){
        main.innerHTML = ""
        renderCurrentUpload(photo)
    }else{
        places = data.places
        main.innerHTML=""
        renderCurrentUpload(photo)
        for (let place of places){
            renderPlace(place)
        }
    ;
    }
}

function renderCurrentUpload(photo){
    let currentUploadContainer = document.createElement("div")
    currentUploadContainer.classList.add("current-upload")
    let currentImage = document.createElement("img")
    currentImage.style.maxWidth = "150px"
    currentImage.src = photo.image_url
    let currentName = document.createElement("h3")
    currentName.textContent = `Adding Photo: ${photo.name}`
    let currentLocation = document.createElement("p")
    currentLocation.textContent = `Longitude: ${photo.longitude}, Latitude: ${photo.latitude}`
    currentUploadContainer.append(currentImage)
    currentUploadContainer.append(currentName)
    currentUploadContainer.append(currentLocation)
    currentUploadContainer.append(createPlaceForm(photo))
    main.append(currentUploadContainer)
}

function createPlaceForm(photo){
    let form = document.createElement("form")
    form.classList.add("new-location")
    let formBody = `
    <label for="place-name">Location Name</label>
    <input type="text" id="place-name" name="name" required>
    <input type="hidden" name="longitude" value=${photo.longitude}>
    <input type="hidden" name="latitude" value=${photo.latitude}>
    <input type="submit" value="Add Location" classList.add("div.form")="add-location">`
    form.innerHTML= formBody
    return form
}

function renderPlace(place){
    let currentPlace = place
    let placeDiv = document.createElement("div")
    placeDiv.dataset.placeId = place.id
    let placeImage = document.createElement("img")
    placeImage.style.maxWidth = "200px"
    placeImage.classList.add("place-image")
    placeImage.src = place.photos[0].image_url
    let placeName = document.createElement("h3")
    placeName.textContent = place.name
    let placeLocation = document.createElement("p")
    placeLocation.textContent = `Longitude: ${place.longitude}, Latitude: ${place.latitude}`
    placeDiv.append(placeImage)
    placeDiv.append(placeName)
    placeDiv.append(placeLocation)
    let placeJoin = document.createElement("button")
    placeJoin.textContent = "Join this Location"
    placeJoin.dataset.placeId = place.id
    placeDiv.append(placeJoin)
    main.append(placeDiv)
}

function uploadPhotoLook(){
    main.innerHTML=`
    <img src="assets/photoguy.png" align="right" alt="Photo Guy" width="600"
        height="600">

        <div classList.add("div.form")="take">
            <br />
            Take a
        </div>
        <br />
        <div classList.add("div.form")="picture">
            Picture
        </div>
        <br />
        <div classList.add("div.form")="para">
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
    <div id="map" classList.add("div.form")="edit-map">
    </div>
    <br>
    <label for="date">Date of Photo</label>
    <input type="datetime-local" id="date" name="date" value="" required>
    <br>
    <input type="submit" classList.add("div.form")="edited-photo">
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
    const formDiv = document.createElement("div")
    const picDiv = document.createElement("div")
    const form = document.createElement("form")
    const intro = document.createElement('p')
    intro.classList.add("introText")
    intro.innerText = "Welcome to Pictory please create a username to get started"
    formDiv.classList.add("form")
    picDiv.classList.add("logo")
    form.classList.add(".login-form")
    picDiv.innerHTML = `
        <img src="assets/loginlogo.png" alt="picture" width="250"> `
    const formBody = `
        <input type="text" placeholder="username" name="username" required>
        <input type="submit" classList.add("button")>`
    form.innerHTML = formBody
    formDiv.append(picDiv)
    formDiv.append(intro)
    formDiv.append(form)
    main.append(formDiv)

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
        <input type="submit" classList.add("div.form")="upload-image" required>`
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





      

     