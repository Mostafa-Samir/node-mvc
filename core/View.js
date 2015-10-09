var fs = require('fs');
var path = require('path');

/*
 * renders an html file as a view
 * @param file {String}: the html file to render
 * @param connection {Object}: the object containing http request and response objects
 * @param fields {Object}: the values of fields in the view to render
 */
exports.render = function(file, connection ,fields) {
  
    var values = fields || {};
    
    fs.readFile("./views/" + file + ".html",'utf8' ,function(err, data) {
       if(err)
           console.log("The view [" + file + "] does not exist");
        else {
            
            // replace the fields in the view with their values
            data = data.replace(/\{\{\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\}\}/g, function(field) { return values[field.replace(/[\{\}]/g, '')]; });
            
            connection.res.writeHead(200, {'Content-Type' : 'text/html'});
            connection.res.end(data);
        }
    });
};

