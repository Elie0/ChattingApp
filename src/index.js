const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generatMessage,generateLocationMessage} = require('./utils/messages')      // it is destructuring, only grabbing generateMessage fct instead of grabbing messages.generate....
const {addUser,removeUser,getRoomUsers,getUser} = require('./utils/users')
const app = express()
const server = http.createServer(app)   // to use socket.io
const io = socketio(server)

const port = process.env.PORT || 3030

app.use(express.static('public'))

io.on('connection',(socket)=>{       // we can use io to communicate with a specific client if i have diff clients it will run many times
       console.log('New Websocket connection')

   
     socket.on('join',({username,room},acknowledge)=>{
        console.log(username)
        const user = addUser({id:socket.id, username, room})
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getRoomUsers(user.room) //returns users in tht room
        })

        if(user.error){
            console.log(user.error)
            return acknowledge(user.error)
        }
           
        socket.join(user.room)
        socket.emit('message',generatMessage(`welcome ${user.username} to chatApp`))
        socket.broadcast.to(user.room).emit('message',generatMessage(`${user.username} has Joined`)) //sends this to all users except the one whoe joined
        acknowledge()  // without argument so telling no error
    
     })
     


    socket.on('send',(m,acknowledge)=>{
        const user = getUser(socket.id)
        console.log(m)
        const filter = new Filter()
        if(filter.isProfane(m))
        {
            return acknowledge('Profanity is not allowed',undefined) //since acknowledge is cb(error,message)
        }
        io.to(user.room).emit('message',generatMessage(m,user.username))  //io.to() to send only in a specific room   
        acknowledge(undefined,'Delievered!') // acknowledge is cb fct
        
    })

    socket.on('sendLocation',(location,acknowledge)=>{
        const user = getUser(socket.id)
        io.emit('locationMessage',generateLocationMessage((`https://google.com/maps?q=${location.latitude},${location.longitude}`),user.username)) //genlocationmessage returns an object with location and time
        acknowledge('Location shared') // acknowledge is cb fct
        
    })

    socket.on('disconnect',()=>{  // it is handled from scoket.io no need to add anything on user side, alone when a user disconnects it works
        const user = removeUser(socket.id)
        
        if(user){

            io.to(user.room).emit('message',generatMessage(`${user.username} has left`) )//// we can use io to make all clients listen if we use socket only the specific client will
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getRoomUsers(user.room)
            })

        }
        
    }) 

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})