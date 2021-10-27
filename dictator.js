//Vincent Pak, John Connors 
// Creates the server side Dictator game
//Created: 10/21/2021

var http = require('http');
var fs = require('fs');
var url = require('url');

const port_num = 8000;
const host_name = 'localhost';
const file_name = 'dictator_page.html'

http.createServer(
    function(req, resp){
        var p_n = url.parse(req.url).pathname; 

        if(p_n == '/dictator_game'){ 
            var query = url.parse(req.url).query;
            console.log("query " + query + " received.");
            var spawn = require('child_process').spawn; 
        
            var child_proc = spawn('python.exe', ["dictator_game.py", query]); 
            child_proc.stdout.on('data', function(data){
                console.log("Child Process Output:" + data); 
                resp.writeHead(200, {"Content-Type": 'text/html'}); 
                resp.write(data.toString()); 
                resp.end(); 
            });
        }

        else{
            fs.readFile(p_n.substr(1), function(err, data){
                if(err){
                    console.log(err); 
                    resp.writeHead(404, {'Content-Type':'text/html'}); 
                }
                else{
                    resp.writeHead(200, {'Content-Type': 'text/html'});
                    resp.write(data.toString());
                }
                resp.end(); 
            }); 
        }
    }
).listen(port_num); 

console.log(`Running Server at http://${host_name}:${port_num}/${file_name}`);

