const {deleteComment} = require('../models/delete-comment')

exports.removeComment = (req, res, next)=>{
    const id = req.params.comment_id
    
    deleteComment(id).then(()=>{
        res.status(204).send();
    })
    .catch((err)=>{
        next(err)
    })
     
    }
    