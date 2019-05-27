//Dependencies
const https = require('https');
var fs      = require('fs');
request = require('request');

//models
var User = require('./../models/User');
var Response = require('./../models/Response');


let page = 1;

exports.findUserById = function(req, res){
    var user = new User();    
    https.get("https://reqres.in/api/users/"+req.params.id, (resp) => {
    let data = '';
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        let response = JSON.parse(data);
        user.fill(response.data);
        res.send(new Response(200, "", user));
    });

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    res.send(new Response(400, "An error is happen", {}));
    });
};

exports.findImage = (req, res) =>{
    var user = new User();   
    //get the file
    fs.readFile(req.params.id+".jpg", (err, data)=>{
        
        //if image does not exist, make request
        if(err){
            https.get("https://reqres.in/api/users/"+req.params.id, (resp) => {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            
            resp.on('end', () => {
                let response = JSON.parse(data);
                user.fill(response.data);
                download(user.avatar, user.id+".jpg", ()=>{
                    fs.readFile(req.params.id+".jpg", (err, data)=>{
                        //convert image file to base64-encoded string
                        let base64Image = new Buffer(data, 'binary').toString('base64');     
                        let imgSrcString = `data:image/jpg;base64,${base64Image}`;
                        res.send(new Response(200, "",{avatar:imgSrcString}));
                    })
                })
            });

            }).on("error", (err) => {
            console.log("Error: " + err.message);
            res.send(new Response(400, "An error is happen", {}));
            });
        }else{ // if does exist, just conver to base64 and send from fileSystem..
            
            //convert image file to base64-encoded string
            let base64Image = new Buffer(data, 'binary').toString('base64');
            
            //combine all strings
            let imgSrcString = `data:image/jpg;base64,${base64Image}`;
            res.send(new Response(200, "",{avatar:imgSrcString}));
        }
    });
    
}

exports.deleteAvatar = (req, res)=>{
    fs.unlinkSync(req.params.id+".jpg");
    res.send(new Response(200, "The image has been detelete from server", {}));
}

/*
    task CRON JOB logic
*/

exports.cronUsers = (data) => {
    fs.readFile('users.json', (err, data)=>{
        let myUsers = JSON.parse(data);        
        //get users page
        https.get("https://reqres.in/api/users?page="+page, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                let response = JSON.parse(data);
                //
                myUsers.data.push(response.data);
                fs.writeFile('users.json', JSON.stringify(myUsers), (err) => {  
                    if (err) throw err;
                    console.log('Data written to file');
                    page += 1;
                });
            });
            }).on("error", (err) => {
                console.log("Error: " + err.message);
                res.send(new Response(400, "An error is happen", {}));
            });
    });    
}


var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};