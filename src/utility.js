class ErrorResponse {
    constructor() {
        this._message = '';
    }

    set message(msg) {
        this._message = msg;
    }

    get name() {
        return this._message;
    }
}


function GetClientHost(req) {
    if (req.headers["x-forwarded-for"] != null) {
        return req.headers["x-forwarded-for"]
    }
    else if (req.connection.remoteAddress != null) {
        if (req.connection.remoteAddress == "::1")
            return "localhost";
        return req.connection.remoteAddress;
    } 
    else if (req.host != null) {
        return req.host;
    }    
    return "";
}

function CreateError (errorMessage) {
    var error = new ErrorResponse();
    error.message = errorMessage;

    return error;
}

//Returns list of headers 
function GetAllHeaders (req) {
    console.log(JSON.stringify(req.headers));
    return req.headers;
}

module.exports = { GetClientHost, CreateError, GetAllHeaders};
