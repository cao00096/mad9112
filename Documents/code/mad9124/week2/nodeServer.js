'use strict'

const http = require('http')


const requestHandler =(req,res)=>{
    if (req.url ==='./api'){
        const data ={message :'Hello world from Node.js'}
        res.statusCode=200
        res.setHeader('Content-Type','application/json')
        res.write(JSON.stringify({data}))//shorthand for {data:data}
        res.end()
    }else{
        res.write('Hello world from Node.js')
        res.end()
    }
}

const server =http.createServer(requestHandler)

//cost server=http.createServer()
// const server =http.createServer()
// server.on('request',(req,res)=>{
//     res.write('Hello world from Node.js')
//     res.end()
// })


server.listen(3030,(err)=>{
    if(err){
        console.error('something went wrong', err)
    }
    console.log('Server listening on port 3030 ...')
})
