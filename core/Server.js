var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    mime = require('mime'),
    Route = require('../routes');

var server = http.createServer(function (request, response) {
    
    var request_body = "";
    
    // buffer the request body data as they come
    request.on('data', function (chunck) {
        request_body += chunck.toString();
    });
    
    // wait till the request has fully arrived before handeling it
    request.on('end', function () {
        
        // handled to the route callback
        var connection = { req: request, res: response };
        
        // append the body to the connection.req
        connection.req.body = request_body;

        var request_path = request.url;
        
        // append a tailing '/' to request path if it doesn't exists
        if (request_path[request_path.length - 1] !== '/')
            request_path += '/';
        
        // try to resolve the request_path form the defined routes
        switch (request.method) {
            
            case "GET":
                var resolution = Route.get.resolve(request_path);
                if (resolution.is404) {
                    
                    // remove the tailing and heading '/' form request path and treat at as local-file
                    request_path = request_path.slice(0, request_path.length - 1);
                    fs.readFile("./public" + request_path, function (err, data) {
                        if (err) {
                            // no file exists in the public directory with the request path
                            // run the 404 callback
                            
                            var returned_data = resolution.callback(connection);
                            if (typeof returned_data !== "undefined") {
                                // the route callback returned html-data to be served
                                response.writeHead(200, { 'Content-Type' : 'text/html' });
                                response.end(returned_data);
                            }
                        }
                        else {
                            // the a file with the request path was found in the public directory
                            var content_type = mime.lookup(request_path);
                            response.writeHead(200, { 'Content-Type' : content_type });
                            response.end(data);
                        }
                    });
                }
                else {
                    var returned_data = resolution.callback(connection, resolution.route_args);
                    if (typeof returned_data !== "undefined") {
                        // the route callback returned html-data to be served
                        response.writeHead(200, { 'Content-Type' : 'text/html' });
                        response.end(returned_data);
                    }
                }
                break; //end witch case
            
            case "POST":
                var resolution = Route.post.resolve(request_path);
                var returned_data = resolution.callback(connection, resolution.route_args);
                if (typeof returned_data !== "undefined") {
                    // the route callback returned html-data to be served
                    response.writeHead(200, { 'Content-Type' : 'text/html' });
                    response.end(returned_data);
                }
                break;
            
            case "PUT":
                var resolution = Route.put.resolve(request_path);
                var returned_data = resolution.callback(connection, resolution.route_args);
                if (typeof returned_data !== "undefined") {
                    // the route callback returned html-data to be served
                    response.writeHead(200, { 'Content-Type' : 'text/html' });
                    response.end(returned_data);
                }
                break;
        
            case "DELETE":
                var resolution = Route.delete.resolve(request_path);
                var returned_data = resolution.callback(connection, resolution.route_args);
                if (typeof returned_data !== "undefined") {
                    // the route callback returned html-data to be served
                    response.writeHead(200, { 'Content-Type' : 'text/html' });
                    response.end(returned_data);
                }
                break;
            
            default:
                // unsupported http method
                response.writeHead(200, { 'Content-Type' : 'text/plain' });
                response.end("Unsupported HTTP Method");
        }
    });
});

module.exports = server;