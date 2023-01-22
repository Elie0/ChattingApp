// io() // used to connect to the server in index.html file
const socket = io()
// socket.on('countUpdated' , (count) =>{
//     console.log('The count has been updated '+count)
// })
// document.querySelector('#increment').addEventListener('click',()=>{
                                                               
//     // accessing the button created in idex.html by its id and listening to whenever it is clicked
//     console.log('clicked')
//     socket.emit('increment')  // now this is from the client side (the opposite)
// })

//elements:

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')      // to hear the input inside the CHatmessage form
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML //to access the script template in index.html and its inner html
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options : note that in js location.search returns the object of query example: '?username=elie&room=32' that we wrote in the form
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true}) // to remove the query symbol '?' use {ignore...}

const autoscroll = ()=>{
    const element=$messages.lastElementChild
    Math.ceil( element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"}))
    
}





socket.on('message',(m)=>{
    console.log(m)
    const html = Mustache.render(messageTemplate,{
        message:m.text,  
        createdAt:moment(m.createdAt).format('h:mm a'),       // moment was imported from src link in index.html script js link just like we did for mustach dynamic template we are doing this since installing via npm is only for serverside and not for client frontend
                                                          // check moment docs to see how we set parameters and change the interface of time
        username: m.username,
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(location)=>{
    console.log(location.url)
    const html = Mustache.render(locationTemplate,{
        url:location.url,
        createdAt:moment(location.createdAt).format('h:mm a'),
        username:location.username
    })
    $messages.insertAdjacentHTML('beforeend',html)   //insertadjacently to what already already exists
    autoscroll()
})

socket.on('sendUser',(message)=>{
    console.log(message)    
})
socket.on('sendLocation',(location)=>{
    console.log(location)
})

socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
   document.querySelector("#sidebar").innerHTML = html // did not use isertadjacent in order to replace what already exists

})


        $messageForm.addEventListener('submit',(e)=>{
        e.preventDefault()
        $messageFormButton.setAttribute('disabled','disabled') // when we input on the form, it becomes disabled for other inputs until i enable it later after the acknowledgment
         message = $messageFormInput.value
       // const secondway_toget_msg = e.target.elements.message.value // target=form elements are: input and button, only input has a name=message
        socket.emit('send',message,(error,ackmsg)=>{      //the 3rd fct argument is a callback used to acknowledge that message was received by server

            $messageFormButton.removeAttribute('disabled','disabled') // now we can enter another message and press input
            $messageFormInput.value = ''  // to reset what is written on the input form to nothing
            $messageFormInput.focus()  // to keep the cursor active on the input form

            if(error)
            {
                return console.log(error)
            }
            else{
                console.log(ackmsg)
            }
        }) 
    })


    document.querySelector('#send-location').addEventListener('click',()=>{

        $sendLocationButton.setAttribute('disabled','disabled')
        if(!navigator.geolocation)
        {
            return alert('Geolocation is not supported by your browser')
        }

        navigator.geolocation.getCurrentPosition((postion)=>{            // used to get my location
               //console.log(postion) to see what it provides in order to know how to get longitude....
               socket.emit('sendLocation',{

                    latitude:postion.coords.latitude,
                    longitude:postion.coords.longitude
               }, (ack)=>{
                $sendLocationButton.removeAttribute('disabled','disabled')
                console.log(ack)
     })
        })
    })

    socket.emit('join',{username,room},(ack)=>{
        if(ack)
        {
            alert(ack)
            location.href='/'     //location is global js used to redirect if set = '/'
        }
    })

 






