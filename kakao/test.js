const http = require('http'); 
const fs = require('fs');
const call_obj_arr = [
    {'cop':'한신IT 구내식당',   'url' : 'https://pf.kakao.com/_QRALxb'},  //한신It
    {'cop':'벽산1차 구내식당',  'url' : 'https://pf.kakao.com/_swtYxl'}   //벽산1차
];
const now = new Date();
const file_nm = 'url_' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + '.txt';

function test(){
    
}

const server = http.createServer(function(request, response){ 

    //console.log(request.url);
    
    //response.end('local server 8080');
    if(request.url == '/'){
        
        console.log('url is "/"');        
        test(request, response);

    } else if(request.url == '/favicon.ico') {

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