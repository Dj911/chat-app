
exports.generateMsg = (text,username = "Admin")=>{
    return {
        text,
        uname: username,
        createdAt: new Date().getTime()
    }
}

exports.generateLocationMessage = (lat,longi,username = "Admin")=>{
    return {
        url:`https://google.com/maps?q=${lat},${longi}`,
        uname: username,
        createdAt: new Date().getTime()
    }
}

exports.renderRoomData = (room,users)=>{
    return {
        room,
        users
    }
}