const http = require('http'); 
const axios = require('axios');   
const qs = require('querystring');
const url = require('url');
const fs = require('fs');
const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');

const auth_call_url     = 'https://auth.worksmobile.com/oauth2/v2.0/authorize';
const token_call_url    = 'https://auth.worksmobile.com/oauth2/v2.0/token';
const client_id         = 'FRFzmahSt6vPPCsmU4hO';
const cliend_secret_id  = 'oL3bNoi7Ab';
const service_id        = 't1vk1.serviceaccount@develople.com';
const channel_id        = '7c7d15af-2be7-5bd7-ed6d-1236355752fd';
const bot_id            = 6097162;

function works_auth(request, response){
    
    console.log('* works_auth *');

    let params = {};

    params.client_id        = client_id;
    params.redirect_uri     = 'http://106.242.212.178:18080/result_auth';
    params.scope            = 'bot';
    params.response_type    = 'code';
    params.state            = 'develople';

    console.log('params : ' + qs.stringify(params));    

    response.writeHead(302, {"Location" : auth_call_url + '?' + qs.stringify(params)});
	response.end();
   
};

const works_auth_result = async(request) => {

    console.log('* works_auth_result *');

    let data        = url.parse(request.url, true).query;
    let result;
    let now         = new Date();
    let params      = {};

    params.code             = data.code;
    params.grant_type       = 'authorization_code';
    params.client_id        = client_id;
    params.client_secret    = cliend_secret_id;
    params.domain           = 300093128; 

    await axios({
        method          : 'post',                                      
        url             : token_call_url,             
        headers         : {'Content-Type' : 'application/x-www-form-urlencoded'},
        data            : params          
    }).then((res) =>{
        //console.log(res.data);
        //console.log(res);
        result = res.data;
    });

    return result;
    // response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    // response.end(result);
 
};

const message_send = async(data) => {

    console.log('* message_send *');
    console.log(data);

    let message_url = 'https://www.worksapis.com/v1.0/bots/' + bot_id + '/channels/' + channel_id + '/messages';
    let params = {};
    
    params.content = {};
    params.content.type = 'text';
    params.content.text = '으이그~2';

    console.log(JSON.stringify(params));

    console.log('access token : ' + data.access_token);

    await axios({
        method          : 'post',                                      
        url             : message_url,             
        headers         : {                               
            'Authorization' : 'Bearer ' + data.access_token,
            'Content-Type'  : 'application/json'
        },
        data            : params
    }).then((res) =>{
        // console.log(res.data);
        // message_send(res.data);       
    })

}

//서버설정
const server = http.createServer(function(request, response){ 

    console.log('URL : ' + request.url);

    let url = request.url.split('?');

    if(url[0] == '/'){
        console.log('url is "/"');

        works_auth(request, response);     
        response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
        response.end();   
        
    } else if(url[0] == '/favicon.ico') {

        console.log('url is "/favicon"');

        // response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
        // response.end();
        //return;
    } else if(url[0] == '/result_auth') {

        console.log('* /result_auth * ');

        works_auth_result(request).then(res =>{
            message_send(res);
        });

        response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
        response.end('메시지 전송 성공');   

    } else {       
        
        console.log('url is "/else..."');
        response.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
        response.end('페이지 없음');
    }
    
});

server.listen(8080, function(){ 
    console.log('local server on!!');
});