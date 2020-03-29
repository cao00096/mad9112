'use strict'

const express =require('express')
const app =express()

app.get('/',(request,response)=>{
    //res.code=200
    response.send('Hello from Express!')
})

const cars = [
    {id:1, make:'Tesla', model:'S',colour:'Black'},
    {id:2, make:'Tesla', model:'3',colour:'Red'},
    {id:3, make:'Tesla', model:'X',colour:'Silver'},
    {id:4, make:'Tesla', model:'Y',colour:'Chesnut'},
]
app.get('/api/cars',(request,response)=>{
    response.send({data:cars})
})


app.get('/api', (request,response)=>{
    response.send({
        data:{
            message: 'Hello from Express! '
        }
    })
})
app.listen(3030,err =>{
    if (err) return console.log('something went wrong', err )
    console.log('Server listening on port 3030 ...')
})

