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
    }else if(e.target.classList.contains("new-location")){
        newLocation(e.target)
    }
})

function newLocation(form){
    let locationName = form.name.value
    let locationLatitude = parseFloat(form.latitude.value)
    let locationLongitude = parseFloat(form.longitude.value)
    let photoId = parseInt(document.querySelector(".current-upload").dataset.photoId)
    let configObj = {
        method: "POST",
        headers: {"content-type": "application/json",
        "accepts": "application/json"},
        body: JSON.stringify({name: locationName, latitude: locationLatitude, longitude: locationLongitude,
            photo_id: photoId})
        }
        
    fetch("http://localhost:3000/locations", configObj)
    .then(resp => resp.json())
    .then(data => joinLocation(data))
}

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
    currentUploadContainer.dataset.photoId = photo.id
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
    <input type="submit" value="Add Location" class="add-location">`
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
    placeJoin.classList.add("join-location")
    placeJoin.dataset.placeId = place.id
    placeDiv.append(placeJoin)
    main.append(placeDiv)
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
        map(photo.longitude, photo.latitude, photo.image_url, 15)
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
        } else if (e.target.classList.contains("join-location")){
            joinLocation(e.target)
        } else if (e.target.classList.contains("single-photo")){
            renderBigPhoto(e.target)
        }
    })
}

function renderBigPhoto(photo){
    main.innerHTML = ""
    const photoId = photo.dataset.photoId
    fetch(`http://localhost:3000/photos/${photoId}`)
    .then(resp => resp.json())
    .then(console.log)
}

function individualPhotoPage(photo){
    const photoContainer = document.createElement("div")
    const title = document.createElement("h2")
    title.textContent = photo.name
    const image = document.createElement("img")
    image.src = photo.image_url
    const caption = document.createElement("h3")
    caption.textContent = photo.caption
    const date = document.createElement("p")
    date.textContent= (new Date(photo.date)).toDateString()
    const credit = document.createElement("h6")
    credit.innerHTML = `Photo Credit: <strong></strong>`
    if (photo.poster){
        const poster = credit.querySelector("strong")
        poster.textContent = photo.poster.username
        poster.dataset.userId = photo.poster.id
    }else{
        const poster = "Anonymous"
    }
    photoContainer.append(title)
    photoContainer.append(image)
    photoContainer.append(caption)
    photoContainer.append(date)
    photoContainer.append(credit)
    if (photo.comments.length > 0){
        for (let comment of photo.comments){
        renderComments(comment)}
    }
}

function renderComments(comment){
    
}

function joinLocation(button){
    let locationId = parseInt(button.dataset.placeId)
    let photoId = parseInt(document.querySelector(".current-upload").dataset.photoId)
    let configObj ={
        method: "POST",
        headers: {"content-type": "application/json",
    "accepts": "application/json"},
        body: JSON.stringify({location_id: locationId, photo_id: photoId})
    }
    fetch("http://localhost:3000/location_photos/", configObj)
    .then(resp => resp.json())
    .then(data => joinedLocationRender(data) )
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

function joinedLocationRender(data){
    let places = data.photos
    main.innerHTML= ""
    let title = document.createElement("h2")
    title.innerHTML = data.name
    let locationP = document.createElement("p")
    locationP.textContent = `Longitude: ${data.longitude}, Latitude: ${data.latitude}`
    main.append(title)
    main.append(locationP)
    for (let place of places){
        main.append(renderPhotoInfo(place))
    }

}

function renderPhotoInfo(photo){
    debugger
    let photoDiv = document.createElement("div")
    photoDiv.classList.add("single-photo")
    let photoImg = document.createElement("img")
    photoImg.dataset.photoId = photo.id
    photoImg.style.maxWidth="200px"
    photoImg.src = photo.image_url
    let photoName = document.createElement("h3")
    photoName.textContent = photo.name
    let datePhoto = (new Date(photo.date)).toDateString()
    let dateP = document.createElement("p")
    dateP.textContent = datePhoto
    photoDiv.append(photoImg)
    photoDiv.append(photoName)
    photoDiv.append(dateP)
    return photoDiv
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
        shadowUrl: './assets/squaremarker.png',
        iconUrl: img,

        shadowSize: [75, 95], // size of the shadow
        iconSize: [30, 47], // size of the shadow
        shadowAnchor: [22, 94], // point of the shadow which will correspond to marker's location
        iconAnchor: [0, 87],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    if (zoom != 3){
        let marker = L.marker([latitude, longitude], { icon: imageIcon });
        function markerInfo(e) {
            console.dir(e)
            debugger
        }
        marker.addTo(map).bindPopup(`<img src=${img} width="200px"><p>Something</p>`)
            // .on('click', e => markerInfo(e.target))
        // map.addLayer(marker)}
    }
    function onMapClick(e) {
        if (document.querySelector("#map").classList.contains("edit-map")){
            map.eachLayer(layer => {
                if(layer.options.icon){
                    map.removeLayer(layer)
                } })
            let newLat = e.latlng["lat"]
            let newLong = e.latlng["lng"]
            marker = L.marker([newLat, newLong], { icon: imageIcon })
            marker.addTo(map).bindPopup(`<img src=${img} width="200px"><p>Something</p>`)
            document.querySelector("#latitude").value = e.latlng["lat"].toFixed(4)
            document.querySelector("#longitude").value = e.latlng["lng"].toFixed(4)
            marker.addTo(map)

            }
    }


    map.on('dblclick', onMapClick);
    
}
