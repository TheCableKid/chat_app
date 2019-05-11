var express = require('express');
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var mongoose = require('mongoose');
var bodyParser = require("body-parser")
var dbUrl = "mongodb://localhost:27017/simple-chat"
mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
    console.log("mongodb connected", err);
})
var Message = mongoose.model("Message", { name: String, message: String })
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

io.on("connection", function(socket){
    console.log("a user connected: " + socket.id);
    socket.on("disconnect", function(){
        console.log("user disconnected: " + socket.id);
    });
 });



app.get('/messages', (req, res) => {
    console.log("Got a Get Request")
    Message.find({}, (err, messages) => {
        if (err) {
            console.log("Get Error:", err)
            return res.sendStatus(500)
        }
        console.log("Sending Messages:", messages)
        res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    console.log("Gotta Post Request:", req.body)
    var message = new Message(req.body);
    message.save((err) => {
        if (err) {
            console.log("Post Error:", err)
            return res.sendStatus(500);
        }
        res.sendStatus(200);
    })
})

server.listen(3000, () => {
    console.log('server is running on port ', server.address().port);
});
