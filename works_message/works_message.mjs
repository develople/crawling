import axios from 'axios';
import fs from 'fs';
import jwt from 'jsonwebtoken';

// const axios = require('axios');   
//const qs = require('querystring');
//const url = require('url');
// const fs = require('fs');
//const crypto = require('crypto');
// const jwt = require('jsonwebtoken');

//--------------------------------------------------------------------> const params 
const client_id         = 'FRFzmahSt6vPPCsmU4hO';
const cliend_secret_id  = 'oL3bNoi7Ab';
const service_id        = 't1vk1.serviceaccount@develople.com';
// const channel_id        = '7c7d15af-2be7-5bd7-ed6d-1236355752fd';
const channel_id        = '9fa36e1e-e1b9-4148-2424-48dc557c6283';
const bot_id            = 6960006;
const scope             = 'bot'
const private_key       = fs.readFileSync('./works_message/private.key', 'utf8');
const token_call_url    = 'https://auth.worksmobile.com/oauth2/v2.0/token';

const jwt_token_call = async() => {

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

}

const message_send = async(data, url, name) => {

    console.log('* message_send : access token : ' + data.access_token + ' *');

    let message_url = 'https://www.worksapis.com/v1.0/bots/' + bot_id + '/channels/' + channel_id + '/messages';
    let params = {};
    // let img_url = fs.readFileSync('./kakao/' + file_nm, 'utf8');
    
    params.content = {};
    params.content.type = 'text';
    params.content.text = name + ' 예약가능 :: ' + url;

    // params.content.type                 = 'image';
    
    // let img_array = JSON.parse(img_url);                   

    // await img_array.forEach(function(obj){

        // params.content.previewImageUrl      = obj.img_url;
        // params.content.originalContentUrl   = obj.img_url;

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

}

export async function message_send_start(url, name) {

    let result = await jwt_token_call();
    await message_send(result, url, name);

}