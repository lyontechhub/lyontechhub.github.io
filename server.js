var express = require('express');
var app = express();

app.use(require('prerender-node')
    .set('prerenderServiceUrl', 'http://mighty-waters-2486.herokuapp.com/')
    .set('beforeRender', function(req, done) {
        console.log('bot request url : ' + req.url);
        done();
    }));
/*app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/views', express.static(__dirname + '/views'));
app.use('/data', express.static(__dirname + '/data'));
app.use('/imgs', express.static(__dirname + '/imgs'));**/
app.use(express.static(__dirname + '/dist'));
app.use('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var port = Number(process.env.PORT || 3000);
app.listen(port, function() {
    console.log("Listening on port " + port);
});