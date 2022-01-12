//数据库处理模块
let db = require("mysql");
//创建数据库连接
function getConn(host='localhost',user='root',pwd='root',database='wechat'){
    let conn = db.createConnection({
        host     : host,
        user     : user,
        password : pwd,
        database : database
    });
    conn.connect();
    return conn;  //返回连接
}
//导出数据库方法
module.exports = {
    add:function(table,cols,vals){
        return new Promise((resolve,reject)=>{
            //获取数据库连接
            let conn = getConn();
            //SQL
            let sql = "INSERT INTO `"+table+"`(";
            sql += cols.join();
            sql += ") VALUES('";
            sql += vals.join("','");
            sql += "')";
            //执行SQL
            conn.query(sql, function (error, results, fields) {
                if (error)
                    reject(error);
                //查看受影响的行数
                if(results.affectedRows){
                    console.log("新增成功...");
                    resolve(results.affectedRows);
                }
            });
            //关闭连接
            conn.end();
        })
    },
    search:function(table,where){
        return new Promise((resolve,reject)=>{
            //获取数据库连接
            let conn = getConn();
            /*
            {username:yss,pwd:123}
            */
            //SQL
            let sql = "SELECT * FROM `"+table+"`";
            if(typeof where == "object" && where != null){
                sql += " WHERE"
                for(let k in where){
                    sql += ` ${k}='${where[k]}' AND`;
                }
                sql = sql.slice(0,-3);
            }
            //执行SQL
            conn.query(sql, function (error, results, fields) {
                if (error)
                    reject(error);
                //返回结果集
                resolve(results);
            });
            //关闭连接
            conn.end();
        })
    },
    //联表查询
    searchAll:function(tableA,tableB,join,where=1,fields="*",order="ASC"){//order:排序，asc为升序，desc为降序
      //where:{id:1}
      //SELECT `friends`.*,`user`.`uname`,`user`.`profile` FROM `friends` INNER JOIN `user` ON `friends`.`fa`=`user`.`id` WHERE `friends`.`is_true` = 0 AND `friends`.`is_read`=0
      return new Promise((resolve,reject)=>{
          //获取数据库连接
          let conn = getConn();
          //SQL
          let sql = `SELECT ${fields} FROM ${tableA} INNER JOIN ${tableB} ON ${join} WHERE ${where} ORDER BY ${tableA}.id ${order}`;
          //执行SQL
          conn.query(sql, function (error, results, fields) {
              if (error)
                  reject(error);
              //返回结果集
              resolve(results);
          });
          //关闭连接
          conn.end();
      })
    },
    //或者条件
    getAll:function(table,where,order="ASC"){
        return new Promise((resolve,reject)=>{
            //获取数据库连接
            let conn = getConn();
            //SQL
            let sql = "SELECT * FROM `"+table+"`";
            if(typeof where == "object" && where != null){
                sql += " WHERE"
                for(let k in where){
                    sql += ` ${k}='${where[k]}' OR`;
                }
                sql = sql.slice(0,-2);
            }
            sql += "ORDER BY `id` "+order;
            //执行SQL
            conn.query(sql, function (error, results, fields) {
                if (error)
                    reject(error);
                //返回结果集
                resolve(results);
            });
            //关闭连接
            conn.end();
        })
    },
    //获取数据通用方法
    getRes:function(table,where,order="ASC",fields="*"){
      return new Promise((resolve,reject)=>{
          //获取数据库连接
          let conn = getConn();
          //SQL
          let sql = `SELECT ${fields} FROM ${table} WHERE ${where} ORDER BY id ${order}`;
          //执行SQL
          conn.query(sql, function (error, results, fields) {
              if (error)
                  reject(error);
              //返回结果集
              resolve(results);
          });
          //关闭连接
          conn.end();
      })
    },
    update:function(table,data,where){
        return new Promise((resolve,reject)=>{
            //获取数据库连接
            let conn = getConn();
            /*
            {profile:"profile.jpg"}  --  data
            */
            //SQL
            let sql = "UPDATE `"+table+"`";
            //更新的字段
            if(typeof data == "object" && data != null){
                sql += " SET "
                for(let k in data){
                    sql += `${k}='${data[k]}',`;
                }
                sql = sql.slice(0,-1);
            }
            //更新的条件
            if(typeof where == "object" && where != null){
                sql += " WHERE"
                for(let k in where){
                    sql += ` ${k}='${where[k]}' AND`;
                }
                sql = sql.slice(0,-3);
            }
            //执行SQL
            conn.query(sql, function (error, results, fields) {
                if (error)
                    reject(error);
                //返回影响行数
                if(results.affectedRows>0){
                    console.log("数据修改成功");
                    resolve(results.affectedRows);
                }
            });
            //关闭连接
            conn.end();
        })
    },
    //删除
    del:function(table,where){
      return new Promise((resolve,reject)=>{
          //获取数据库连接
          let conn = getConn();
          //SQL
          let sql = "DELETE FROM `"+table+"`";
          //删除的条件
          if(typeof where == "object" && where != null){
              sql += " WHERE"
              for(let k in where){
                  sql += ` ${k}='${where[k]}' AND`;
              }
              sql = sql.slice(0,-3);
          }
          //执行SQL
          conn.query(sql, function (error, results, fields) {
              if (error)
                  reject(error);
              //返回影响行数
              if(results.affectedRows>0){
                  console.log("数据删除成功");
                  resolve(results.affectedRows);
              }
          });
          //关闭连接
          conn.end();
      })
    }
}
