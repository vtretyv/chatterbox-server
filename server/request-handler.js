/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var http = require('http');
var querystring = require('querystring');


var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
var data = {
  results: [
    {
      username: 'David',
      roomname: 'lobby',
      text: 'Hello?'
    },
    {
      username: 'Vlad',
      roomname: 'lobby',
      text: 'Anyone there?'
    }
  ]
};

var requestHandler = function(request, response) {
  // var data = {
  //   results: [
  //     {
  //       username: 'David',
  //       roomname: 'lobby',
  //       text: 'Hello?'
  //     },
  //     {
  //       username: 'Vlad',
  //       roomname: 'lobby',
  //       text: 'Anyone there?'
  //     }
  //   ]
  // };
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  // console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var responseObj = 'Reponse Object Initialized';
  var statusCode = 200;
  //DEAL WITH WRONG ENDPOINT
  if ( request.url !== '/classes/messages') {
    console.log('In the 404');
    statusCode = 404;
    response.writeHead(404, 'ERROR URL not found' );
    response.end(responseObj);
  } 
  //DEAL WITH REQUEST METHODS
  switch (request.method) {
  case 'GET':
    statusCode = 200;
    responseObj = JSON.stringify(data);
    
    break;
  case 'OPTIONS':
    statusCode = 200;
    break;
  case 'POST':
    //console.log(response.on);
    var body = '';
    request.on('data', function(data) {
      console.log('POST DATA??? ', data);
      body += data;
    });

    request.on('end', function() {
      console.log('BODY AT END START', body);
      console.log('BODY TYPE AT END START', typeof body);
      console.log('BODY TYPE AT END START', body[0]);
      //console.log('BODY TYPE AT END START', typeof JSON.parse(body));
      
      //if (typeof body === 'string') {
      console.log('IN THE STRING');
      if (body[0] === '{' && typeof JSON.parse(body) === 'object') {
        //console.log('IN THE IF, DANGER ZONE');
        data.results.unshift(JSON.parse(body));
        responseObj = JSON.stringify(data);
      } else {
        //console.log('IN THE ELSE, DANGER ZONE');
        data.results.unshift(querystring.parse(body));
        responseObj = JSON.stringify(data);
      }
      console.log('response', responseObj);
      //JSON.parse(responseObj);
      response.end(responseObj);
    });



    statusCode = 201;
    break;
  case 'PUT':
    statusCode = 201;
    break;
  default:
    statusCode = 404;
  }
  
  //TRIED TO ADD CONDITIONAL FOR DEALING WITH DIFFERENT ENDPOINT

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  // console.log('respons?: ', response.writeHead);
  //console.log(headers['access-control-allow-methods']);
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  
  

  response.writeHead(statusCode, headers);
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // console.log(responseObj);
  response.end(responseObj);
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

module.exports.requestHandler = requestHandler;




    // var options = {
    //   hostname: 'localhost',
    //   port: 3000,
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // };
    // var req = http.request(options, function(res) {
    //   console.log('STATUS:', res.statusCode);
    //   console.log('HEADERS:', JSON.stringify(res.headers));
    //   res.setEncoding('utf8');

    //   res.on('data', function(chunk) {
    //     console.log('NEW DATA', chunk);
    //   });
    // });
    // req.on('error', function(e) {
    //   console.log('ERROR ', e.message);
    // });
    // console.log('hi');

