exports.singup = function (connection, args) {
    var res = "I got some singup data, here they are";
    res += connection.req.body;

    return res;
}