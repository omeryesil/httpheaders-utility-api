var express = require ('express');
var path = require('path'); //just for the test html file
var cookieParser = require('cookie-parser')
var cors = require('cors')

//var bodyParser = require('body-parser'); // for parsing json - not really required at the moment

var chalk = require('chalk'); //for coloring

var utility = require('./utility');

const settings = require('./config/appsettings.json');

var app = express();

app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin (backend-mobile apps, or curl/wget requests
        console.log("Request from: " + origin);
        if(!origin) return callback(null, true);
        if(settings.corsDomains.indexOf(origin) === -1){
            var msg = 'CORS violation: This service does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true
}));


//app.use(bodyParser.json());
app.use(cookieParser());
app.use(function(req, res, next) {
    console.log("Enabling Headers and Methods");

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

//Create a cookie
app.get("/v1/cookie", function (req, res) {        
    //signed and not signed cookies
    //console.log('Not signed Cookies: ', req.cookies);
    //console.log('Signed Cookies: ', req.signedCookies);

    var authToken = utility.GetToken(req);

    if (authToken == null) {     
        var error = utility.CreateError("Authorization header is missing");
        console.log(chalk.red('ERROR:' + error._message + ' (' +  utility.GetClientHost(req) + ')'));    
        res.status(400).send(error);    
        return;
    }
    
    res.cookie(settings.cookie.name, authToken, { httpOnly: true });

    console.log(settings.cookie.name + " has been created by " + utility.GetClientHost(req));

    res.json('{"result": "success"}');
});

//Delete the cookie
app.delete("/v1/cookie", (req, res, next   ) => {
    res.clearCookie(settings.cookie.name);

    console.log(settings.cookie.name + " has been deleted by " + utility.GetClientHost(req));
    res.status(204);
});

app.get("/v1/test/", function (req, res) {        
    res.sendFile(path.join(__dirname + '/test/test.html'));
});

app.get("/swagger/v1/swagger.json", function (req, res) {        
    res.sendFile(path.join(__dirname + '/swagger.json'));
});

//start the server
app.listen(settings.server.port, settings.server.host, () => {
    console.log("Bim Auth Api --------------------------------------");
    console.log("Server running on port " + settings.server.port);
});


