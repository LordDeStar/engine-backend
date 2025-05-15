const express = require('express');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const app = express();


const storageDir = path.join(__dirname, 'projects');
if (!fs.existsSync(storageDir)){
    fs.mkdirSync(storageDir);
}
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use('/', express.static(storageDir));


const createProject = (userId, title)=>{
    const userFolder = path.join(storageDir, `user-${userId}`);
    const projectFolder = path.join(userFolder, title);
    if (!fs.existsSync(userFolder)){
        fs.mkdirSync(userFolder);
    }
    if (!fs.existsSync(projectFolder)){
        fs.mkdirSync(projectFolder);
    }
}
app.post('/upload', (req, res, next) => {
   const {file, fileName, folderPath} = req.body;
   const dir = path.join(storageDir, folderPath);
   console.log('\n'+dir+'\n');
   if (!fs.existsSync(dir)){
    res.status(400).json({error: "Папка не сущетвует!"});
    return;
   }
    const buffer = Buffer.from(file, 'base64');
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, buffer);
    res.status(201).json({ok: 'ok'});

});



app.post('/create-folder', (req, res)=>{
    const {pathToFolder, title} = req.body;
    const relative = path.join(pathToFolder, title);
    const finalPath = path.join(storageDir, relative);
    if (!fs.existsSync(finalPath)){
        fs.mkdirSync(finalPath);
        res.status(201).json({ok: "ok"});
    }
    else{
        res.status(400).json({error: "Такая пакпа уже существует!"})
    }
    
})


app.post('/create-project', (req, res)=>{
    const {userId, title} = req.body;
    createProject(userId, title);
    res.status(201).json({ok: "Все у нас прекрасно!"});
})

app.listen(3000, ()=>{
    console.log('Server starts on http://localhost:3000');
})