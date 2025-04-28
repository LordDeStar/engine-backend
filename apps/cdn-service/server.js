const express = require('express');
const app = express();

app.get('/test', (req, res)=>{
    res.send("Hello");
})

app.listen(3000, ()=>{
    console.log('Server starts on http://localhost:3000');
})