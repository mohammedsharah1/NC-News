const {fetchApi} = require('../models/fetch-api')


exports.getApi = (req,res,next) =>{
    fetchApi().then((endpoints)=>{
        res.status(200).send({endpoints})
    })
}