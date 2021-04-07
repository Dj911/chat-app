const users = [];
const createError = require('http-errors')

exports.addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // VALIDATE IF USERNAME OR ROOM NOT ENTERED
    if (!username || !room) return { error: "Username and room required" }

    // VALIDATE IF USERNAME AND ROOM ALREADY EXISTS
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    // VALIDATE IF USERNAME AND ROOM ALREADY EXISTS
    if (existingUser) return { error: "Username in use" }

    const user = { id, username, room };
    users.push(user);
    return { user }
}

exports.removeUser = (id) => {
    const removedUser = users.findIndex((user) => user.id === id);

    if (removedUser !== -1) {
        return users.splice(removedUser, 1)[0];
    }
}

exports.getUser = (id) => {
    const user = users.find((u) => {
        if (u.id === id) {
            return u
        }
    });
    if (!user) return {error: "NO USER FOUND!"}
    return {user}
}

exports.getUsersInRoom = (room) => {
    room = room.toLowerCase();
    let allUsers = []
    users.find((el) => {
        if (el.room.toLowerCase() === room) allUsers.push(el)
    })
    return allUsers;
}