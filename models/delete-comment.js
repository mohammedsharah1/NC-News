const db = require("../db/connection");

exports.deleteComment = (id) =>{
    return db.query(`DELETE FROM comments WHERE comment_id=$1 RETURNING*`, [id])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'comment id not found',})
        }else{
            return rows[0]}
        
    })
    }