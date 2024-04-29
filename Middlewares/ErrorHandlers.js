const ErrorHandler = (err, req, res, next)=>{
    const statusCode = res.statusCode ? res.statusCode : 500
    
    
    switch (statusCode) {
        case 400:
    res.send({message : err.message , status : false, title : "Validation Error"});
            
            break;
    case 401:
    res.send({message : err.message , status : false, title : "UnAuthorised Access"});
    case 404:
    res.send({message : err.message , status : false, title : "Not Found"});
    case 500:
    res.send({message : err.message , stackTrace : err.stack, title : "Server Error"});
    
        default:
            console.log("No Error working tree clean");
            break;
    }
    };
    module.exports = ErrorHandler