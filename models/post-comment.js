const db = require("../db/connection");
exports.postComment = (id,author,body) =>{
    if(!author || !body){
       return Promise.reject({
          status:400,
          msg: "bad request properties missing",
      })}
    
       return db.query(`INSERT INTO comments (article_id, author,body) VALUES ($1, $2, $3) RETURNING *;`, [id, author, body]).then(({rows})=>{
         if(rows.length === 0){
          return Promise.reject({
             status:404,
             msg: "id not found",
         })
         }else{ 
          return rows[0] 
       }
        
      })
      
 } 