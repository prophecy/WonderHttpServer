

exports.GetUserCredential = function() {

    return {
        username:"aabb@mail.com",
        password:"111111"
    };
}

exports.GetFriendCredential = function() {

    return {
        username:"friend@mail.com",
        password:"111111"
    }
}

exports.GetInvalidUserCredential = function() {

    return {
        username:"aabb@mail.com",
        password:"11111x"
    };
}

exports.GetValidEmail = function() {

    return "aabb@mail.com";
}