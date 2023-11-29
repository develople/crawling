const http = require('http'); 
const fs = require('fs');
const puppeteer = require('puppeteer-core');
const cheerio = require('cheerio');


const call_obj_arr = [
    {'cop': 'w728', 'url' : 'https://pcmap.place.naver.com/accommodation/1115967168/room?from=map&fromPanelNum=2&x=126.7921889&y=33.55911869999999&timestamp=202311291612&businessCategory=pension&level=top&guest=2&checkin=20231223&checkout=20231226#'},  //한신It
];
const now = new Date();
// const file_nm = 'url_' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + '.txt';

const naver_crawling = (request, response) => {
    console.log('naver_crawling start')

    const cheerio = require('cheerio');
    const axios = require('axios');   

    let result_html = ''; 
    let cnt = 0;

    // console.log(img_url_check());

    call_obj_arr.forEach(async (obj) => {
        //console.log(obj.cop);
        try {

            await axios({
                url: obj.url,
                method: 'get'
            }).then(async (html) => {
                cnt++;
                const $ = cheerio.load(html.data);
                
                console.log($('#app-root').html())

                // let get_html = $('body > .place_thumb').eq(1).html()
                //console.log(get_html);
                
                // result_html += '<div>'
                //     + '    <h1>' + obj.cop + '</h1>'
                //     + '    <img src=' + img_base64 + ' />'
                //     + '</div>'
                //     + '<br />';

                
            });

        } catch (error) {

            console.log(' url crawling error!!!!!!!!!!!!!!!!!! ');

        }

    });  

};

const naver_crawling_puppeteer = (request, response) => {

    (async () => {
        
        const browser = await puppeteer.launch({
        //headless:false로 변경하면 브라우저 창이 뜨는것을 볼 수 있습니다.
        headless:false, 
        
        // 크롬이 설치된 위치를 입력해줍니다. 엣지 등 크로미움 기반의 웹브라우저도 지원됩니다.
        executablePath: '/usr/local/bin/chromium' 
        });
        const page = await browser.newPage();
        await page.goto('https://pcmap.place.naver.com/accommodation/1115967168/room?from=map&fromPanelNum=2&x=126.7921889&y=33.55911869999999&timestamp=202311291612&businessCategory=pension&level=top&guest=2&checkin=20231223&checkout=20231226');
    
        await sleep(5000);
        const content = await page.content();
        // console.log(content)

        const $ = cheerio.load(content);
                
        console.log($('#app-root .flicking-viewport').eq(1).find('.place_thumb > div').eq(0).html())

        //fullPage:false로 하면 현재 브라우저에서 보이는 영역만 스크린캡쳐를 뜨게 됩니다.
        // await page.screenshot({path: 'example.png', fullPage:true});
        // await browser.close();
       })();
}

const sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve, ms)
    })
}

const server = http.createServer(function(request, response){ 

    //console.log(request.url);
    
    //response.end('local server 8080');
    if(request.url == '/'){
        
        console.log('url is "/"');        
        // naver_crawling(request, response);
        naver_crawling_puppeteer(request, response);
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