const mysql = require('mysql2');
const conn = mysql.createPool({
    host            : '192.168.50.5',               // url or ip
    port            : '13306',
    database        : 'develople_dev',              // db
    user            : 'admin',                      // 계정
    password        : 'elqpffhvmf!23',              // 비밀번호
    connectionLimit : 30
});

const get_connection = (callback) => {
    conn.getConnection((err, conn) => {
        if(!err) {
            callback(conn);
        }
    });
}

module.exports = get_connection;