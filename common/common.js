// 나중에 호출로 쓸 수 있게 정리할 내용들


function rsa_encrypt(){

    crypto = require('crypto');

    const encryptByPrivKey = (message) => {
        return crypto.privateEncrypt(rsaPrivKey, Buffer.from(message, 'utf8')).toString('base64');
    };

    const decryptByPubKey = (encryptedMessage) => {
        return crypto.publicDecrypt(rsaPubKey, Buffer.from(encryptedMessage, 'base64')).toString();
    };

    const encryptByPubKey = (message) => {
        return crypto.publicEncrypt(rsaPubKey, Buffer.from(message, 'utf8')).toString('base64');
    };

    const decryptByPrivKey = (encryptedMessage) => {
        return crypto.privateDecrypt(rsaPrivKey, Buffer.from(encryptedMessage, 'base64')).toString();
    };
}

/**
 * 
 * @param {'true or false'} async 
 * @param {'./example directoy&path'} file_path 
 */
function file_read(async, file_path){

    const fs = require('fs');
    

    if(async) {
        //비동기
        fs.readFile('./works_message/private.key', 'utf8', (err, data) => {

            if(err){

                console.log(err);
                return '';

            } 

                return data;

            });

    } else {

        return fs.readFileSync('./works_message/private.key', 'utf8');

    }

}

function axios_call(){
    
    axios({
        method          : 'get',                                            // 통신 방식
        url             : 'www.naver.com',                                  // 서버
        headers         : {'X-Requested-With': 'XMLHttpRequest'},           // 요청 헤더 설정
        data            : { api_key: '1234', langualge: 'en' },             // 
        responseType    : 'json',                                           // default
        
        maxContentLength: 2000,                                             // http 응답 내용의 max 사이즈
        validateStatus: function (status) {
          return status >= 200 && status < 300;                             // default
        },                                                                  // HTTP응답 상태 코드에 대해 promise의 반환 값이 resolve 또는 reject 할지 지정
        proxy: {
          host: '127.0.0.1',
          port: 9000,
          auth: {
            username: 'mikeymike',
            password: 'rapunz3l'
          }
        },                                                                  // proxy서버의 hostname과 port를 정의
        maxRedirects: 5,                                                    // node.js에서 사용되는 리다이렉트 최대치를 지정
        httpsAgent: new https.Agent({ keepAlive: true }),                   // node.js에서 https를 요청을 할때 사용자 정의 agent를 정의
    })
    .then(function (response) {
        // response Action
    });

}