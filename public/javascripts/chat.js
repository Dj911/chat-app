// const { use } = require("../../app");

const socket = io();    //?Connection established Client -> Server
const $form = document.getElementById('formSubmit');
const $formMessageInput = document.getElementById('ipText')
const locationBtn = document.getElementById('location');
const $messages = document.getElementById('message-div')

// TEMPLATES
let $messageTemplate = document.getElementById('message-template').innerHTML;
let $locationTemplate = document.getElementById('location-template').innerHTML;
let sidebarTemplate = document.getElementById('sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true }) // let url = location.search;

const autoscroll = () => {
    // NEW MSG ELEMENT
    const $newMessage = $messages.lastElementChild;

    // Height of new msg
    const newMsgStyles = getComputedStyle($newMessage);
    const newMsgMargin = parseInt(newMsgStyles.marginBottom)
    const newMsgHeight = $newMessage.offserHeight + newMsgMargin;
    
    // Visible Height
    const visibleHeight = $messages.offsetHeight;

    // Height of msges contianer
    const contianerHeight = $messages.scrollHeight;

    // How far  have wwe scrolled
    const scrollOffSet = $messages.scrollTop + visibleHeight;

    if(contianerHeight - newMsgHeight <= scrollOffSet){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (msg) => {
    const html = Mustache.render($messageTemplate, {
        name: msg.uname,
        msg: msg.text,
        time: moment(msg.createdAt).format("hh:mm a")
    });
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll();
})

socket.on('locationMessage', (loc) => {
    const html = Mustache.render($locationTemplate, {
        name: loc.uname,   // OR (new URLSearchParams(url)).get('username')
        loc: loc.url,
        time: moment(loc.createdAt).format("hh:mm a")
    });
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll();
})

socket.on('renderRoomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.getElementById('sidebar').innerHTML = html;
})
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = "/"
    }
})


$form.addEventListener('submit', (el) => {
    el.preventDefault();
    $formMessageInput.setAttribute('disabled', 'disabled');
    socket.emit('sendMessage', $formMessageInput.value, (err) => {
        $formMessageInput.removeAttribute('disabled');
        $formMessageInput.value = "";
        $formMessageInput.focus()       // Moves the courser inside the input box
        // EVENT ACKNOWLEDGMENT CALLBACK.... [OPTIONAL]
        /// RUNS AFTER THE EVENT.ON
        if (err) return console.log(err);
        console.log('Message Received')
    });
})

locationBtn.addEventListener('click', () => {
    locationBtn.hidden = true;
    if (!navigator.geolocation) return alert('Browser does not support Geolocation')
    navigator.geolocation.getCurrentPosition((pos) => {
        socket.emit('sendLocation', {
            lat: pos.coords.latitude,
            longi: pos.coords.longitude
        }, (err) => {
            locationBtn.hidden = false;
            locationBtn.removeAttribute('disabled');
            if (err) return console.log(err);
            console.log('Location Shared!')
        });
    })
})