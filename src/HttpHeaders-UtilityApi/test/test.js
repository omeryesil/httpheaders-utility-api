var chaiExpect = require('chai').expect;

var untility = require('../utility');

describe ('GetToken', ()=> {
    it ('Should return Authorization Bearer Token', ()=> {
        var expected = 'JWT_TOKEN'

        var req = GenerateReqMock(expected);
     
        var actual = untility.GetToken(req);
        chaiExpect(expected == actual).to.be.true;
    });
});

describe ('GetClientHost from request host', ()=> {
    it ("Should return hostname from host ", ()=> {
        var expected = "test.com";

        var req = GenerateReqMock(null, expected, null);

        var actual = untility.GetClientHost(req);

        console.log(actual);

        chaiExpect(expected == actual).to.be.true;
    });
});


describe ('GetClientHost from request remoteAddress', ()=> {
    it ("Should return hostname from remoteAddress ", ()=> {
        var expected = "test.com";

        var req = GenerateReqMock(null, null, expected);

        var actual = untility.GetClientHost(req);

        console.log(actual);

        chaiExpect(expected == actual).to.be.true;
    });
});

function GenerateReqMock (jwtToken, host, remoteAddress) {
    var mockedRequest = {
        headers : {
            authorization : 'Bearer ' + jwtToken
        },
        host : host,
        connection: {
            remoteAddress: remoteAddress
        }
    }
    return mockedRequest;
}