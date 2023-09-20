//--------------------------------------------------------------------> const lib 
const http = require('http'); 
const axios = require('axios');   
//const qs = require('querystring');
//const url = require('url');
const fs = require('fs');
//const crypto = require('crypto');
const jwt = require('jsonwebtoken');

//--------------------------------------------------------------------> const params 
const client_id         = 'FRFzmahSt6vPPCsmU4hO';
const cliend_secret_id  = 'oL3bNoi7Ab';
const service_id        = 't1vk1.serviceaccount@develople.com';
const channel_id        = '7c7d15af-2be7-5bd7-ed6d-1236355752fd';
const bot_id            = 6097162;
const scope             = 'bot'
const private_key       = fs.readFileSync('./works_message/private.key', 'utf8');
const token_call_url    = 'https://auth.worksmobile.com/oauth2/v2.0/token';
const now               = new Date();
const file_nm           = 'url_' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + '.txt';

//--------------------------------------------------------------------> function
const jwt_token_call = async(request, response) => {
    
    // 서비스 계정으로 access token  발급, bot message 전송 시 필요    
    console.log('* jwt_token_call *');
       
    let result;
    let payload = {
        'iss' : client_id,                                         
        'sub' : service_id                                      
    };

    let token = jwt.sign(payload, private_key, { 
        algorithm : 'RS256',
        expiresIn : '1h'
    });
    
    //console.log('token => ' + token);

    //let verified = jwt.verify(token, private_key);
    //console.log('verified : ' + JSON.stringify(verified));

    let params = {};
    params.assertion        = token;
    params.grant_type       = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
    params.client_id        = client_id;
    params.client_secret    = cliend_secret_id;
    params.scope            = scope;

    await axios({
        method          : 'post',                                      
        url             : token_call_url,             
        headers         : {                               
            'Content-Type'  : 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data            : params
    }).then((res) =>{
        //console.log(res.data);
        //message_send(res.data);        
        result = res.data;
    })

    return result;

};

const message_send = async(data) => {

    console.log('* message_send : access token : ' + data.access_token + ' *');

    let message_url = 'https://www.worksapis.com/v1.0/bots/' + bot_id + '/channels/' + channel_id + '/messages';
    let params = {};
    let img_url = fs.readFileSync('./kakao/' + file_nm, 'utf8');
    
    params.content = {};
    // params.content.type = 'text';
    // params.content.text = '으이그~';

    params.content.type                 = 'image';
    
    let img_array = JSON.parse(img_url);                   

    await img_array.forEach(function(obj){

        params.content.previewImageUrl      = obj.img_url;
        params.content.originalContentUrl   = obj.img_url;

        axios({
            method          : 'post',                                      
            url             : message_url,             
            headers         : {                               
                'Authorization' : 'Bearer ' + data.access_token,
                'Content-Type'  : 'application/json'
            },
            data            : params
        }).then((res) =>{
        
            // console.log('> code : ' + res.data.code);
            // console.log('> description : ' + res.data.description);

            //console.log(res.data);             
        })

    })

};



//서버설정
const server = http.createServer(function(request, response){ 


    console.log('URL : ' + request.url);

    let url = request.url.split('?');

    if(url[0] == '/'){
        console.log('url is "/"');

        response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
        response.end('빈페이지. /bot_call 로 호출 시 img 전송.');

    } else if(url[0] == '/bot_call') {
        console.log('url is "/bot_call"');
    
        let call = async() => {
            let result = await jwt_token_call(request, response)
            await message_send(result);
        };

        try {
            
            call();
            
            response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
            response.end('bot 전송 완료.');

        } catch(err) {

            response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
            response.end('bot 전송 ERROR.');

        }

    } else if(url[0] == '/favicon.ico') {

        console.log('url is "/favicon"');

        // response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
        // response.end();
        //return;
    } else {       
        
        console.log('url is "/else..."');
        response.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
        response.end('페이지 없음');
    }
    
});

server.listen(8080, function(){ 
    console.log('local server on!!');
});