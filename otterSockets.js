var _ = require("underscore");
var socketPort = process.env.PORT || "2222";
var io = require('socket.io')(socketPort);
var sioRedis = require("socket.io-redis");
var adapter = sioRedis({host: 'localhost', port: 6379});
adapter.pubClient.on("error", 
    function (err) {
        console.log("[error] redis adapter pub error: " + err);      
    }
);
adapter.subClient.on("error", 
    function (err) {
        console.log("[error] redis adapter pub error: " + err);      
    }
);

io.adapter(adapter);
  
console.log("Running OtterSockets on port %s", socketPort);

io.on('connection', function (socket) {
    console.log("[connect] socket [%s]", socket.id);
    
    socket.emit("start", "connected to otterSockets");
    
    socket.on('message', function () { });
    
    socket.on('disconnect', function () { 
        console.log("[disconnect] socket [%s]", socket.id);
    });
    
    socket.on("subscribe", function (subscription) {
        console.log("[subscribe] %s joined %s", socket.id, subscription['channels']);
        if (_.has(subscription, "channels")) {
            _.each(subscription['channels'],
                function (channel) {
                    socket.join(channel);
                    io.in(channel).emit("join", {channel: channel});      
                }
            );
            
        }
    })
});
