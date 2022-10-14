const {postComment} = require('../models/post-comment')

exports.newComment= (req,res,next) =>{
    const {body, author} = req.body
    const id = req.params.article_id

   
    postComment(id, author,body).
    then((comments)=>{
        res.status(201).send({comments})
    }) 
.catch((err)=>{
    next(err)
})
}