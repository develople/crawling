import schedule from 'node-schedule';
import { message_send_start } from './works_message/works_message.mjs';

// import http from 'http';
// import fs from 'fs';
import puppeteer from 'puppeteer-core';
import cheerio from 'cheerio';

const call_obj_arr = [
    {'name': 'w728','order': 1 ,'url' : 'https://pcmap.place.naver.com/accommodation/1115967168/room?from=map&fromPanelNum=2&x=126.7921889&y=33.55911869999999&timestamp=202311291612&businessCategory=pension&level=top&guest=2&checkin=20231223&checkout=20231225'},
    {'name': '오형제-둘','order': 2 ,'url' : 'https://pcmap.place.naver.com/accommodation/1173450306/room?from=map&fromPanelNum=1&x=126.1973545&y=33.3398737&timestamp=202311292123&businessCategory=pension&level=top&guest=2&checkin=20231223&checkout=20231225'},
    {'name': '제주무이-구름','order': 1 ,'url' : 'https://pcmap.place.naver.com/accommodation/32390340/room?from=map&fromPanelNum=1&x=126.3886016&y=33.4689983&timestamp=202311292218&businessCategory=pension&level=top&guest=2&checkin=20231223&checkout=20231225'},
    {'name': '야호스카이하우스-그레이스트윈오션뷰','order': 3 ,'url' : 'https://pcmap.place.naver.com/accommodation/1222351784/room?from=map&fromPanelNum=1&x=126.3886016&y=33.4689983&timestamp=202311292218&businessCategory=pension&level=top&guest=2&checkin=20231223&checkout=20231225'},
    {'name': '바람돌이하우스-안거리','order': 2 ,'url' : 'https://pcmap.place.naver.com/accommodation/32430179/room?from=map&fromPanelNum=1&x=126.8047021&y=33.5563319&timestamp=202311292222&businessCategory=pension&level=top&guest=2&checkin=20231223&checkout=20231225'},

];

const server_env = process.argv[2];

const naver_crawling_puppeteer = async () => {
    // let availableList = [];

    console.log('서버 ENV : ' + server_env)
    // for (const obj of call_obj_arr) {
    call_obj_arr.forEach(async obj => {
        
        await (async () => {
            console.log('name : ' + obj.name + ', order : ' + obj.order )
            // console.log(obj.url)

            let executablePath = '';
            if(server_env == 'local') {
                executablePath = '/opt/homebrew/bin/chromium';
            } else if(server_env == 'dev') {
                executablePath = '/opt/homebrew/bin/chromium';
            }

            let browser = await puppeteer.launch({
                //headless:false로 변경하면 브라우저 창이 뜨는것을 볼 수 있습니다.
                headless: true, 
                
                // 크롬이 설치된 위치를 입력해줍니다. 엣지 등 크로미움 기반의 웹브라우저도 지원됩니다.
                // executablePath: '/usr/local/bin/chromium' 
                executablePath: executablePath
            });
            let page = await browser.newPage();
            await page.goto(obj.url);
        
            await sleep(5000);
            let content = await page.content();

            let $ = cheerio.load(content);
                    
            // console.log($('#app-root .flicking-viewport').eq(1).find('.place_thumb').eq(obj.order -1).html())

            let html = $('#app-root .flicking-viewport').eq(1).find('.place_thumb').eq(obj.order -1).html();
            let reserveAvailable = html.indexOf('예약마감') ? 'N' : 'Y';
            
            console.log('예약가능여부 : ' + reserveAvailable)
            
            if('Y' == reserveAvailable) {
                message_send_start(obj.url, obj.name);
            }


            //fullPage:false로 하면 현재 브라우저에서 보이는 영역만 스크린캡쳐를 뜨게 됩니다.
            // await page.screenshot({path: 'example.png', fullPage:true});
            await browser.close();
            
        })();
    })
    // console.log('availableList : ::' + availableList)
    // return availableList;
}

const sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve, ms)
    })
}

// naver_crawling_puppeteer();




const regularExec = schedule.scheduleJob('0 0/5 * * * *', async ()=>{ // 5분마다 실행
    // const msg = require('./works_message/works_message.mjs');
    // msg.message_send_start()
    // const test = require('./works_message/test.js')
    let availableList = await naver_crawling_puppeteer()
    // console.log('availableList' + availableList);
    // message_send_start();
})


// const http = require('http'); 
// const fs = require('fs');
// const puppeteer = require('puppeteer-core');
// const cheerio = require('cheerio');
