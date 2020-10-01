const main = document.querySelector("main")
let loggedUser = 0
document.addEventListener("DOMContentLoaded", e =>{
    clickHandler();  
    submitHandler();
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
    }else if(e.target.classList.contains("new-location")){
        newLocation(e.target)
    } else if (e.target.classList.contains("comment-form")) {
        addComment(e.target)
    } else if (e.target.classList.contains("edit-comment-form")) {
        commentPatch(e.target)
    } 
})

function commentPatch(edited){
    
    let configObj = {
        method: "PATCH",
        headers: {"content-type": "application/json",
        "accepts": "application/json"},
        body: JSON.stringify({comment: edited.comment.value})
    }
    
    fetch("http://localhost:3000/comments/" + edited.dataset.commentId, configObj)
        .then(renderBigPhoto(edited.parentElement.nextElementSibling))
}
function addComment(form){
    let photo_id = form.dataset.photoId
    let comment_text = form.comment.value
    let configObj = {
        method: "POST",
        headers: {"content-type": "application/json",
    "accepts": "application/json"},
        body: JSON.stringify({
            user_id: loggedUser,
            photo_id,
            comment_text 
        })
    }
    
    fetch("http://localhost:3000/comments", configObj)
    .then(renderBigPhoto(form))
}

function deletePhoto(button){
    
    let configObj = {method: "DELETE"}
    let id = button.dataset.photoId
    fetch(`http://localhost:3000/photos/${id}`, configObj)
    .then(resp => myPhotoLook())
}

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
        .then(data => {
            joinedLocationRender(data)
        
    })
}

function editPhoto(photo){
    let name = photo.name.value
    let caption = photo.caption.value
    let date = photo.date.value
    let longitude = parseFloat(photo.longitude.value)
    let latitude = parseFloat(photo.latitude.value)
    let photoId = parseInt(photo.dataset.id)
    let configObj = {
        method: "PATCH",
        headers: {"content-type": "application/json",
        "accepts": "application/json"},
        body: JSON.stringify({name, caption, date, longitude, latitude, user_id: loggedUser})
    }
    fetch(`http://localhost:3000/photos/${photoId}`, configObj)
    .then(resp => resp.json())
    .then(data=> {
        renderPossiblePlaces(data)})
}

function renderPossiblePlaces(data){
    
    photo = data.photo
    photo.latitude = data.location.latitude
    photo.longitude = data.location.longitude
    if (data.found === "none"){
        main.innerHTML = ""
        
        renderCurrentUpload(photo)
    }else{
        
        let places = data.places
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

function uploadPhotoLook(message){
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
        <div class="para" id="para">
        Welcome back
            <br />
        </div>`
        if (message){
            let container = document.querySelector(".para")
            container.innerHTML=message.textContent
        }
        uploadForm();
}

function managePhotoLook(photo){
    main.innerHTML=""
    const photoId = photo.id
    
    const currentPhoto = document.createElement("img")
    const centerContain = document.createElement("div")
    const mapDiv = document.createElement("div")
    const formContain = document.createElement("div")

    currentPhoto.src= photo.image_url
    currentPhoto.className = "picture1"

    formContain.className = "flexbox"

    centerContain.className = "flexbox"
    
    const form = editPhotoForm();

    mapDiv.id = "map"
    mapDiv.classList.add("map1", "edit-map")

    main.append(centerContain)
    centerContain.append(currentPhoto)
    centerContain.append(mapDiv)
    main.append(formContain)
    formContain.append(form)
    
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
    photo.className = "center1"
    manageButton = document.createElement("button")
    manageButton.classList.add("manage", "button1")
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
        } else if (e.target.classList.contains("logout")){
            logout()
        } else if (e.target.classList.contains("my-photos")){
            myPhotoLook()
        } else if (e.target.classList.contains("upload-page")){
            uploadPhotoLook()
        } else if (e.target.classList.contains("delete-photo")) {
            deletePhoto(e.target)
        } else if (e.target.classList.contains("comment-on")){
            addCommentForm(e.target)
        } else if (e.target.classList.contains("edit-comment")){
            editCommentForm(e.target)
        } else if (e.target.classList.contains("location-search")){
            locationSearchPage()
        } else if (e.target.classList.contains("open-location")) {
            getLocation(e.target)
        }else if (e.target.classList.contains("back-search")){
            locationSearchPage(e.target.dataset.longitude, e.target.dataset.latitude)
        }else if (e.target.classList.contains("follow-location")){
            followLocation(e.target)
        }else if (e.target.classList.contains("unfollow-location")){
            unfollowLocation(e.target)
        } else if (e.target.classList.contains("my-locations")){
            myLocations()
        } else if (e.target.classList.contains("my-locale")) {
            getLocation(e.target, "mylocation")        
        }else if (e.target.classList.contains("back-location")){
            myLocations();
        } else if (e.target.classList.contains("delete-comment")) {
            deleteComment(e.target)
        }

    })}

    function deleteComment(button){
        let commentId = button.previousElementSibling.dataset.commentId
        fetch("http://localhost:3000/comments/"+ commentId, {method: "DELETE"})
        .then(button.parentElement.remove())
        
    }
       
    
    function myLocations(){
        let configObj = {method: "POST", 
        headers: {"content-type": "application/json",
                "accepts": "application/json"},
        body: JSON.stringify({user_id: loggedUser})}
        fetch("http://localhost:3000/mylocations", configObj)
        .then(resp => resp.json())
            .then(data => {
                main.innerHTML =""
                let resultsContainer = document.createElement("div")
                resultsContainer.classList.add("search-body")
                main.append(resultsContainer)
                renderMylocation(data)})
    }
    function followLocation(button){
        let user_id = button.dataset.userId
        let location_id = button.dataset.location
        let configObj = {
            method: "POST",
            headers: {"content-type": "application/json",
        "accepts": "application/json"},
        body: JSON.stringify({user_id, location_id})
        }
        fetch("http://localhost:3000/user_locations", configObj)
        .then(resp => resp.json())
        .then(data => joinedLocationRender(data))
    }

    function unfollowLocation(button){
        let user_id = button.dataset.userId
        let location_id = button.dataset.location
        let configObj = {
            method: "DELETE",
            headers: {"content-type": "application/json",
        "accepts": "application/json"},
        body: JSON.stringify({user_id, location_id})
        }
        fetch("http://localhost:3000/unfollow", configObj)
            .then(resp => resp.json())
            .then(data => joinedLocationRender(data))
    }


    function getLocation(button, type= "search"){
        
        fetch("http://localhost:3000/locations/" + button.dataset.placeId)
        .then(resp => resp.json())
        .then(data => {
            data.photos = data.photo_order
            joinedLocationRender(data, type)})
    }
function locationSearchPage(longitude = -74, latitude = 40.730610){
        main.innerHTML=`<div id="map" class="search">
        </div>
        <div class="search-body">
        </div>`
        map(longitude, latitude, "assets/photoguy.png", 14)
    }

function editCommentForm(button){
    console.dir(button)
    addCommentForm(button)
    let form = document.querySelector(".comment-form")
    let commentDiv = form.previousElementSibling
    form.className = "edit-comment-form"
    form.dataset.commentId = button.dataset.commentId
    form.comment.value = commentDiv.firstChild.textContent
    commentDiv.remove()
}

function addCommentForm(button){
    
    const commentForm = document.createElement("form")
    commentForm.classList.add("comment-form")
    commentForm.dataset.photoId = button.dataset.photoId
    const formBody = `
    <textarea placeholder="Add a Comment..." name="comment" rows="4" cols="50" required></textarea>
    <input type="submit" value="comment">`

    commentForm.innerHTML = formBody
    const deleteButton = document.createElement("button")
    deleteButton.classList.add("delete-comment")
    deleteButton.textContent = "Delete Comment"
    button.insertAdjacentElement("beforeBegin", commentForm);
    commentForm.insertAdjacentElement("afterend", deleteButton)
    button.remove()
}

function myPhotoLook(){
    main.innerHTML = ""
    const configObj = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accepts": "application/json"
        },
        body: JSON.stringify({
            user_id: loggedUser
        })
    }
    
    fetch("http://localhost:3000/myphotos", configObj)
    .then(resp => resp.json())
    .then(photos => {
        if (photos.length === 0){
            promptUpload()
        }else{
        for (let photo of photos){
            main.append(renderPhotoInfo(photo))
        }}
    })
}

function promptUpload(){
    let prompt = document.createElement("H2")
    prompt.textContent = "You don't seem to have any photos, might we suggest you add some?"
    let uploadButton = document.createElement("button")
    uploadButton.textContent = "Upload"
    uploadButton.classList.add("upload-page")
    main.append(prompt)
    main.append(uploadButton)
}

function logout(){
    loggedUser = 0
    let picky = document.querySelector(".header")
    main.classList.remove("fade-in-fwd")
    let body = document.querySelector("body")
    body.classList.add("padding")
    picky.remove()
    loginForm()
}

function renderBigPhoto(photo){
    main.innerHTML = ""
    const photoId = photo.dataset.photoId
    fetch(`http://localhost:3000/photos/${photoId}`)
    .then(resp => resp.json())
    .then(data=> individualPhotoPage(data))
}

function individualPhotoPage(photo){
    const photoContainer = document.createElement("div")
    const title = document.createElement("h2")
    title.textContent = photo.name
    const image = document.createElement("img")
    image.src = photo.image_url
    image.style.maxWidth = "350px"
    const caption = document.createElement("h3")
    const locationButton = document.createElement("button")
    locationButton.textContent = "See Location"
    locationButton.dataset.placeId = photo.location.id
    locationButton.classList.add("open-location")
    
    caption.textContent = photo.caption
    const date = document.createElement("p")
    date.textContent= (new Date(photo.date)).toDateString()
    const credit = document.createElement("h6")
    credit.innerHTML = `Photo Credit: <strong></strong>`
    let poster = photo.posters[0]
    if (poster){
        const posterInfo = credit.querySelector("strong")
        posterInfo.textContent = poster.username
        posterInfo.dataset.userId = poster.id
        
        if (poster.id === loggedUser){
            let deletePhoto = document.createElement("button")
            deletePhoto.dataset.photoId = photo.id
            deletePhoto.classList.add("delete-photo")
            deletePhoto.textContent = "Delete My Photo"
            credit.append(deletePhoto)
        }
    }else{
        const poster = "Anonymous"
    }
    photoContainer.append(title)
    photoContainer.append(image)
    photoContainer.append(caption)
    photoContainer.append(date)
    photoContainer.append(locationButton)
    photoContainer.append(credit)
    if (photo.comments.length > 0){
        for (let comment of photo.comments){
            photoContainer.append(renderComments(comment))}
    }else{
        let suggestion = document.createElement("div")
        suggestion.textContent = "Be the first"
        photoContainer.append(suggestion)
    }
    let commentButton = document.createElement("button")
    commentButton.textContent = "Add Comment"
    commentButton.classList.add("comment-on")
    commentButton.dataset.photoId = photo.id
    photoContainer.append(commentButton)
    main.append(photoContainer)
}

function renderComments(comment){  
    let commentContainer = document.createElement("div")
    commentContainer.classList.add("comment")
    let commentP = document.createElement("p")
    commentP.textContent =  comment.comment
    let attributedTo = document.createElement("p")
    attributedTo.textContent = comment.user.username
    attributedTo.dataset.userId = comment.user.id
    commentP.append(attributedTo)
    commentContainer.append(commentP)
    if (loggedUser === comment.user.id){
        let editButton = document.createElement("button")
        editButton.textContent = "Edit Comment"
        editButton.classList.add("edit-comment")
        editButton.dataset.commentId = comment.id
        commentContainer.append(editButton)
    }

    return commentContainer


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
    
    const formDiv = document.createElement("div")
    const picDiv = document.createElement("div")
    let loginStyle = `<style>
        body {
          background-image: url('assets/left.png'), url('assets/right.png');
          background-repeat: no-repeat, no-repeat;
          background-position: left, right;
          background-size: auto 100%, auto 100%;
        }
        </style>
`
    main.innerHTML = loginStyle
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
        <input type="submit" class="button")>`
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
    
    fetch("http://localhost:3000/users/", configObj)
    .then(resp => resp.json())
    .then(data =>{
        console.log(data)
        loggedUser = data.user_id
        let headerDiv = document.createElement("div")
        headerDiv.classList.add("header")
        let header = main.insertAdjacentElement("beforeBegin", headerDiv)
        header.innerHTML = ` <div class="header">
        <img src="assets/logoFont.png" align="right" alt="logo" width="100" height="100">
        <p><span class="location-search">Locations</span></p>
    </div>`
        let msg = loggedIn(data)
        uploadPhotoLook(msg)
        main.classList.add("fade-in-fwd")
        header.classList.add("fade-in-fwd")})
    .catch(console.log)
}

function loggedIn(data){
    let picky = document.querySelector(".header img")
    picky.dataset.username = data.username
    picky.dataset.userId = data.user_id
    let welcomeMessage = document.createElement("h2")
    welcomeMessage.textContent= data.message
    let header = document.querySelector(".header")
    let uploadSpan = document.createElement("span")
    uploadSpan.classList.add("upload-page")
    uploadSpan.textContent = "Upload"
    let myPhotoSpan = document.createElement("span")
    myPhotoSpan.classList.add("my-photos")
    myPhotoSpan.textContent = "My Photos"
    let myLocSpan = document.createElement("span")
    myLocSpan.classList.add("my-locations")
    myLocSpan.textContent = "My Locations"
    let logoutSpan = document.createElement("span")
    logoutSpan.classList.add("logout")
    logoutSpan.textContent = "Logout"
    let innerP = header.querySelector("p")
    innerP.append(uploadSpan)
    innerP.append(myPhotoSpan)
    innerP.append(myLocSpan)
    innerP.append(logoutSpan)
    return welcomeMessage
}

function joinedLocationRender(data, type){
    console.log(data)
    let photos = data.photos
    main.innerHTML= ""
    let title = document.createElement("h2")
    title.innerHTML = data.name
    let followButton = document.createElement("button")
    followButton.dataset.userId = loggedUser
    followButton.dataset.location = data.id
    
    if (data.users.find(e => e.id === loggedUser)){
        followButton.classList.add("unfollow-location")
        followButton.textContent = "Unfollow Location"
    }else{
        followButton.classList.add("follow-location")
        followButton.textContent = "Follow Location"
    }
    let backSearch = document.createElement("button")
    if (type === "mylocation"){
        backSearch.className = "back-location"
        backSearch.textContent = "Back to My Locations"

    }else{
    backSearch.innerText = "Back to Search"
    backSearch.classList.add("back-search")
    backSearch.dataset.longitude = data.longitude
    backSearch.dataset.latitude = data.latitude}
    title.append(backSearch)
    title.append(followButton)
    let locationP = document.createElement("p")
    locationP.textContent = `Longitude: ${data.longitude}, Latitude: ${data.latitude}`
    main.append(title)
    main.append(locationP)
    
    for (let photo of photos){
        main.append(renderPhotoInfo(photo))
    }

}

function renderPhotoInfo(photo){
    let photoDiv = document.createElement("div")
    let photoImg = document.createElement("img")
    photoImg.classList.add("single-photo")
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

const map = (longitude, latitude, img, zoom = 13) =>{
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
            
        }
        marker.addTo(map).bindPopup(`<img src=${img} width="200px">`)
            // .on('click', e => markerInfo(e.target))
        // map.addLayer(marker)}
    }
    function onMapDblClick(e) {
        
        if (document.querySelector("#map").classList.contains("edit-map")){
            map.eachLayer(layer => {
                if(layer.options.icon){
                    map.removeLayer(layer)
                } })
            let newLat = e.latlng["lat"]
            let newLong = e.latlng["lng"]
            let marker = L.marker([newLat, newLong], { icon: imageIcon })
            marker.addTo(map).bindPopup(`<img src=${img} width="200px"><p>Something</p>`)
            document.querySelector("#latitude").value = parseFloat(e.latlng["lat"].toFixed(4))
            document.querySelector("#longitude").value = parseFloat(e.latlng["lng"].toFixed(4))
            marker.addTo(map)

        }        else if (document.querySelector("#map").classList.contains("search")){
                map.eachLayer(layer => {
                    if (layer.options.icon) {
                        map.removeLayer(layer)
                    }
                })
                let newLat = e.latlng["lat"]
                let newLong = e.latlng["lng"]
                let   marker = L.marker([newLat, newLong], { icon: imageIcon })
                marker.addTo(map).bindPopup(`<img src=${img} width="200px"><p>Something</p>`)
                let queryLat = parseFloat(e.latlng["lat"].toFixed(4))
                let queryLng = parseFloat(e.latlng["lng"].toFixed(4))
                marker.addTo(map)
                findPlaces(queryLat,queryLng)}
    }
    

    map.doubleClickZoom.disable(); 
    map.on('dblclick', onMapDblClick);
    
    
}



function findPlaces(lat,lng){
    let configObj = {
        method: "POST",
        headers: {"content-type": "application/json",
                "accepts-type": "application/json"},
                body: JSON.stringify({latitude: lat, longitude: lng})
    }
    fetch("http://localhost:3000/locations/search", configObj)
    .then(resp => resp.json())
    .then(data => renderSearchResults(data))
}

function renderSearchResults(data){
    let searchBody = document.querySelector(".search-body")
    searchBody.innerHTML = ""
    if (data.length === 0){
        searchBody.innerHTML = "<h2>No Results Found</h2>"
    }
    
    for (let place of data) {
        indiSearch(place)
    }
}
function renderMylocation(data){
    let searchBody = document.querySelector(".search-body")
    searchBody.innerHTML = ""
    if (data.length === 0){
        searchBody.innerHTML = "<h2>No Results Found</h2>"
    }
    
    for (let place of data) {
        indiSearch(place)
    }
    places = document.querySelectorAll(".open-location")
    for (let place of places){
        place.className="my-locale"
    }
}


function indiSearch(place){
    let searchBody = document.querySelector(".search-body")
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
    placeJoin.textContent = "Open Location"
    placeJoin.classList.add("open-location")
    placeJoin.dataset.placeId = place.id

    placeDiv.append(placeJoin)
    searchBody.append(placeDiv)
}