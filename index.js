//Dependecies
var app = require('express')();

//controllers
const userController = require('./controllers/userController');

//endPoints
app.get("/api/user/:id", userController.findUserById);
app.get("/api/user/:id/avatar", userController.findImage);
app.delete('/api/user/:id/avatar', userController.deleteAvatar);

//cron job each minute
setInterval(()=>{
    userController.cronUsers("");
},60000);

//start server here
port = 3000;
app.listen(port, ()=>{
    console.log("server running in localhost:3000");
})