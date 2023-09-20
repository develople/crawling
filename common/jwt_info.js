//jwt 를 수동으로 구현 시 사용, sign부는 만들기 진행중
function jwt(){
    let data        = url.parse(request.url, true).query;
    let result      = 'code : ' + data.code + ' , state : ' + data.state;
    let private_key = '';


    let token_header = {
        'alg' : 'RSA256',
        'typ' : 'JWT'
    };

       
    let token_payload = {
        'iss' : client_id,                                         
        'sub' : service_id,                                        
        'iat' : '163470495',                                       
        'exp' : '163471495'                                        
    };

    let header64 = Buffer.from(JSON.stringify(token_header), 'utf-8').toString('base64');
    let payload64 = Buffer.from(JSON.stringify(token_payload), 'utf-8').toString('base64');

    // console.log(header64);
    // console.log(payload64);

    let token = header64 + '.' + payload64;

    console.log('token => ' + token);

    private_key = fs.readFileSync('./works_message/private.key', 'utf8');
}