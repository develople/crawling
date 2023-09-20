const http = require('http'); 
const fs = require('fs');
const call_obj_arr = [
    {'cop': '한신IT 구내식당', 'url' : 'https://pf.kakao.com/_QRALxb'},  //한신It
    {'cop': '벽산1차 구내식당', 'url' : 'https://pf.kakao.com/_swtYxl'}   //벽산1차
];
const now = new Date();
const file_nm = 'url_' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + '.txt';

const kakao_crawling = (request, response) => {
    
    const cheerio = require('cheerio');
    const axios = require('axios');   

    let result_html = ''; 
    let file_data = [];
    let cnt = 0;

    console.log(img_url_check());

    if(img_url_check()){

        try{

            let img_url = fs.readFileSync('./kakao/' + file_nm, 'utf8');
            //console.log(img_url);
            let img_array = JSON.parse(img_url);                   

            img_array.forEach(function(obj){
                //console.log(obj);
                result_html += '<div>'
                            + '    <h1>' + obj.cop + '</h1>'
                            + '    <img src=' + obj.img_url + ' />'
                            + '</div>'
                            + '<br />';

            });

            response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
            response.end(result_html);      

        } catch (err) {
            
            console.log('파일읽기 에러');

            response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
            response.end(err);

        }
        

    } else {

        call_obj_arr.forEach(async (obj) => {
            //console.log(obj.cop);
            try {

                await axios({
                    url: obj.url,
                    method: 'get'
                }).then(async (html) => {
                    console.log(0);
                    cnt++;
                    //console.log(html.data);    
                    const $ = cheerio.load(html.data);
                    let img_url = $('meta[property="og:image"]').attr('content');
                    console.log(1);
                    
                    let img_base64;
                    
                    try {

                        const response = await fetch(img_url);    
                        const blob = await response.arrayBuffer();    
                        const contentType = response.headers.get('content-type');    
                        img_base64 = `data:${contentType};base64,${Buffer.from(blob,).toString("base64")}`; //공백등도 영향을 줌.
                
                    } catch (err) {
                
                        console.log('img to base64 err');

                        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        response.end(err);
                
                    }

                    console.log(img_base64 == null);
                    console.log(2);
                    //console.log(img_url);                
                    result_html += '<div>'
                        + '    <h1>' + obj.cop + '</h1>'
                        + '    <img src=' + img_base64 + ' />'
                        + '</div>'
                        + '<br />';

                    file_data.push({ 'cop': obj.cop, 'img_url': img_base64 });
                    //console.log(JSON.stringify(file_data));
                    if (cnt == call_obj_arr.length) {
                        //console.log(result_html);
                        try {

                            console.log('=======> file_data : ' + file_data);
                            console.log('=======> stringify end');

                            fs.writeFileSync('./kakao/' + file_nm, JSON.stringify(file_data));
                            response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                            response.end(result_html);

                        } catch (err) {

                            console.log('파일쓰기 에러');

                            response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                            response.end(err);

                        }
                    }
                });

            } catch (error) {

                console.log(' url crawling error!!!!!!!!!!!!!!!!!! ');

            }

        });  

    }
};


function img_url_check(){
    
    console.log('* img_url_check  : ' + file_nm + ' *');

    return fs.existsSync('./kakao/' + file_nm);

}

const server = http.createServer(function(request, response){ 

    //console.log(request.url);
    
    //response.end('local server 8080');
    if(request.url == '/'){
        
        console.log('url is "/"');        
        kakao_crawling(request, response);

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