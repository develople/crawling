const http = require('http');
const cheerio = require('cheerio');
const axios = require('axios');  
const fs = require('fs');
const mime = require('mime-types');
const uuid = require('uuid');
const get_connection = require('./conn');
const dotenv = require('dotenv').config({
    path:process.env.NODE_ENV == 'local' ? '.local.env' : '.dev.env'
});
const now = new Date();
const dir = now.getFullYear() + '_' + (now.getMonth() + 1) + '_' + now.getDate() + '/';

const filepath = process.env.filepath;
//const reader = new FileReader();

const cafe_select = (request, response) => {
 
    const sql = 'select c.cafe_seq, c.cafe_nm, c.cafe_url from TBL_CAFETERIA c';
    //const sql = 'select c.cafe_img from cafeteria_menu c';
 
    get_connection((conn) => {
        
        conn.query(sql, (err, rows, fields) => {
            
            if (err) throw err;

            // reader.readAsArrayBuffer(rows.cafe_img);
            // reader.onloadend = () =>{
            //     console.log(reader.result);
            // }
            get_cafe_menu(rows);
            //console.log(rows);

        })

        conn.release();

    })
        
};

const get_cafe_menu = (rows) => {

    console.log('* get_cafe_menu : ' + rows.length + ' *');
    
    let cnt = rows.length;     

    if(cnt > 0){

        console.log('rows data 가 존재한다. [' + cnt + ']');

        //const sql = 'insert into TBL_CAFETERIA_MENU values set ?'; //single insert
        const sql = 'insert into TBL_CAFETERIA_MENU (cafe_seq, cafe_img_id, ext, reg_dttm) values ?';
        let values = [];
        let loop = 0;

        rows.forEach((row) => {

            console.log(row.cafe_nm + ' : ' + row.cafe_url);

            axios({
                url: row.cafe_url,
                method: 'get'
            }).then(async (html) => {
                
                const $ = cheerio.load(html.data);
                const menu_url = $('meta[property="og:image"]').attr('content');
                const get_img = await fetch(menu_url);                    
                const type = get_img.headers.get('content-type');
                const ext = mime.extension(type);
                const blob = await get_img.blob();
                const arr_buffer = await blob.arrayBuffer();
                const buffer = Buffer.from(arr_buffer);
                const random_id = uuid.v4();

                if(!fs.existsSync(filepath + dir)){
                    fs.mkdirSync(filepath + dir);
                };
                
                fs.writeFileSync(filepath + dir + random_id + '.' + ext, buffer);
                
                //base64 => 길이때문에 실패
                //const img_base64 = `data:${type};base64,${Buffer.from(blob,).toString("base64")}`; //공백등도 영향을 줌.            
                                               
                // const value = { //single insert
                //     cafe_seq    : row.cafe_seq,
                //     cafe_img_id : random_id,
                //     reg_dttm    : new Date()
                // };


                const value = [row.cafe_seq, random_id, ext, new Date()];

                values.push(value);

                loop++;
                
                if(cnt == loop) {
                    
                    // console.log('db bulk insert');
                    // console.log(JSON.stringify(values));
                    get_connection((conn) => {
        
                        conn.query(sql, [values], (err, result) => {
                            if (err) throw err;                                    
                        });
                
                        conn.release();
                
                    })

                }   

            })
            
        });
 
    } else {

        console.log('rows data 가 존재하지 않음. 종료.');

    };

};

const server = http.createServer(function(request, response){ 

    //console.log(request.url);
    
    //response.end('local server 8080');
    if(request.url == '/'){
        
        console.log('url is "/"');        

        cafe_select(request, response);

        response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
        response.end();


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

server.listen(8090, function(){ 
    console.log('local server on!!');
});