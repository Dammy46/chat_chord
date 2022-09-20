const users = []; //empty array of the users

function userJoin(id, username, room) {
  const user = { id, username, room }; // create user
  users.push(user); // push the created user to the empty users array

  return user;
}

//Get the current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id); //find the current user in the array using the id that is passed in
}

//when user leaves

function userLeave(id) {
  const num = users.findIndex((user) => user.id === id);

  if (num !== -1) {
    return users.splice(num, 1)[0];
  }
}

//Get the user's room
function getUserRoom(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getUserRoom,
};
