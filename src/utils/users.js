const users = []

// add user 

const addUser = ({id,username,room })=>{

    //clean the data  
    username = username.trim().toLowerCase()
    room = room.trim( ).toLowerCase()
    //validate data
    if(!username || !room){
              return {
                error:'Username and Room are required'
              }
    }
       //check for existing user
       const existingUser = users.find((user)=>{
        return (user.username===username)
       })

       // validateUsername
       if(existingUser)
       {
        return{
            error:'Username is already in use'
        }
        
       }

       //storeUser
       const user = {id,username,room}
       users.push(user)
       return user
}

const removeUser = (id)=>{
   const index = users.findIndex((user)=>{
    return user.id === id
   })
   if(index!==-1)  //if we found a match
   {
         return users.splice(index,1)[0] //1 indicates how many elements we wanna remove starting from that index
   }
}

const getUser = (id)=> {
    const get = users.find((user)=> user.id ===id)     // beware, find returns the element found in the array and not an array
    if(!get)
    {
        return undefined
    }

    return get

}


const getRoomUsers = (name)=>{
      
    const get = users.filter((user)=>{
        return user.room ===name
    })
    if(!get)
    {
        return undefined
    }

    return get
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getRoomUsers,
}