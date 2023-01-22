const generatMessage = (text,username)=>{
    return {
        text,
        createdAt: new Date().getTime(),
        username
    }
}
let generateLocationMessage = (url,username)=>{

       return {
                   url,
                   createdAt: new Date().getTime(),              // without the moment library, it shows the time as a very huge number since 1997, use the library on client js side to get the time in good format
                   username, 
       }
}
module.exports = {
    generatMessage,
    generateLocationMessage
}