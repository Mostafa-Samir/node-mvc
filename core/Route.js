// contains the un-parametrized GET routes
var unparameterized_get_routes = {};

// contains the uparametrized GET routes
var parameterized_get_routes = {};

// contains the un-parametrized POST routes
var unparameterized_post_routes = {};

// contains the uparametrized POST routes
var parameterized_post_routes = {};

// contains the un-parametrized PUT routes
var unparameterized_put_routes = {};

// contains the uparametrized PUT routes
var parameterized_put_routes = {};

// contains the un-parametrized DELETE routes
var unparameterized_delete_routes = {};

// contains the uparametrized DELETE routes
var parameterized_delete_routes = {};

// a regular expression to match route parameters
var parameter_exp = new RegExp(/\{[a-zA-Z_$][a-zA-Z0-9_$]*\}/g);


/*
 * appends a route with its callback in the appropriate container out of the given
 * @param route {String}: the route to be appended
 * @param callback {function}: the route's callback function
 * @param unparameterized_container {Object}: the unparemetrized routes container
 * @param parameterized_container {Object}: the paremetrized routes container
 */
function append(route, callback, unparameterized_container, parameterized_container) {
    
    // add a tailing '/' to any route if it doesn't exist
    if(route[route.length - 1] !== '/')
        route += '/';
    
    // check if the route is parameterized
    var parameters = route.match(parameter_exp);
    
    if(parameters === null)
        unparameterized_container[route] = callback;
    else
        parameterized_container[route] = callback;
}


/*
 * resolves a route by request path using given containers
 * @param request_path {String}: the request path
 * @param unparameterized_routes {Object}: the unparemetrized routes container
 * @param parameterized_routes {Object}: the parametrized routes container
 * @return {Object}: an object containing the registered callback and the route arguments (if any)
 */
 function resolve(request_path, unparameterized_routes, parameterized_routes) {
    
    var resolution = {callback: null, route_args: null, is404: false};
    
    // match against the unparameterized routes first
    if(typeof unparameterized_routes[request_path] !== "undefined") {
        
        resolution.callback = unparameterized_routes[request_path];
        return resolution;
    }
    else {
        // match against the parametrized routes
        for(var proute in parameterized_routes) {
            
            var parameters = proute.match(parameter_exp).map(function (param) { return param.replace(/[\{\}]/g, ''); });
            var registered_callback = parameterized_routes[proute];
            
            // a regexp represinting the parameterized route without parameter names
            var proute_exp = new RegExp(proute.replace(parameter_exp, '([a-zA-Z0-9_$]*)'));
            
            var args = request_path.match(proute_exp);
            
            if(args !== null) {
                
                // skip the whole path match
                args = args.slice(1, args.length);
                
                resolution.callback = registered_callback;
                resolution.route_args = {};
                
                // populate the route arguments
                for(var i = 0; i < parameters.length; i++)
                    resolution.route_args[parameters[i]] = args[i];
                
                return resolution;
            }
        }
    }
    
    // no route was matched with the request path, resolve to 404 GET route
    resolution.callback = unparameterized_get_routes['/404/'];
    resolution.is404 = true;
    
    return resolution;
};


/*
 * defines a route with the GET as the request method
 * @param route {String} : the route to be defind
 * @param callback {Function}: the callback function to be called on requesting the route
*/
exports.get = function(route, callback) {
    
    // append the route
    append(route, callback, unparameterized_get_routes, parameterized_get_routes);
};

/*
 * resolves a get request
 * @param request_path {String} : the request_path
 * @return {Object}: an object containing the registered callback and the route arguments (if any)
*/
exports.get.resolve = function(request_path) {
    
    // resolve the request
    return resolve(request_path, unparameterized_get_routes, parameterized_get_routes);
};


/*
 * defines a route with the POST as the request method
 * @param route {String} : the route to be defind
 * @param callback {Function}: the callback function to be called on requesting the route
 */
exports.post = function(route, callback) {
    
    // append the route
    append(route, callback, unparameterized_post_routes, parameterized_post_routes);
};

/*
 * resolves a post request
 * @param request_path {String} : the request_path
 * @return {Object}: an object containing the registered callback and the route arguments (if any)
*/
exports.post.resolve = function(request_path) {
    
    // resolve the request
    return resolve(request_path, unparameterized_post_routes, parameterized_post_routes);
};

/*
 * defines a route with the PUT as the request method
 * @param route {String} : the route to be defind
 * @param callback {Function}: the callback function to be called on requesting the route
 */
exports.put = function(route, callback) {
    
    // append the route
    append(route, callback, unparameterized_put_routes, parameterized_put_routes);
};

/*
 * resolves a put request
 * @param request_path {String} : the request_path
 * @return {Object}: an object containing the registered callback and the route arguments (if any)
*/
exports.put.resolve = function(request_path) {
    
    // resolve the request
    return resolve(request_path, unparameterized_put_routes, parameterized_put_routes);
};

/*
 * defines a route with the DELETE as the request method
 * @param route {String} : the route to be defind
 * @param callback {Function}: the callback function to be called on requesting the route
 */
exports.delete = function(route, callback) {
    
    // append the route
    append(route, callback, unparameterized_delete_routes, parameterized_delete_routes);
};

/*
 * resolves a delete request
 * @param request_path {String} : the request_path
 * @return {Object}: an object containing the registered callback and the route arguments (if any)
*/
exports.delete.resolve = function(request_path) {
    
    // resolve the request
    return resolve(request_path, unparameterized_delete_routes, parameterized_delete_routes);
};



