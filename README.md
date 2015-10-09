# node-mvc
This is the source code of a tiny web mvc framework I built a year ago for node-js. This project was for educational purposes as I wanted to get a feel of how everything can be done from scratch. I thought I might share it in case it can help anyone who's going through the same phase.

The framework mimics the structure of php's laravel 4 and it consists of the following:
* a simple routing engine that supports parameterized routes with GET, POST, PUT, and DELETE methods
* a very tiny templating engine that only supports variables (no conditionals or loops)
* A server built only on node's http native module that works with the routing engine and able to serve static files form the public directory

The structure only imposes constraints on how you define your routes. You're completely free to define the controllers and the models in your own way.

The project uses a tiny third-party module called `mime` which is used to map the files served to their MIME type for the http `Content-Type` header. So you'll need to run `npm install` before you start working with the code.

To run the application, you just type `node run` and it'll be listening on port 8080 by default (unless you changed it).

Note that it's not thoroughly tested (it was an educational project after all) so you'll probably find some bugs here and there. But it's working as a prototype and you can play around with the already defined routes in the source code and see.

The source code is also commented, so I think it's gonna be easy to go through.

## Tips to get started with the workflow

* Any route callback is passed two arguments: 
  * `connection` which is an object containing the http request (`connection.req`) and response (`connection.res`) as attributes. The request attributes also contains a body attributes (`connection.req.body`) that contains the request body.
  * `args` which is an object containing the arguments of the parameterized route (if any) as key-value pairs.
* A call to `View.render` takes three arguments:
  * `file` which is the name of the view to render (without any extensions)
  * `connection` the object you got from the route callback
  * `fields` which is an object that contains the values of the variables in your template in a key-value fashion.
