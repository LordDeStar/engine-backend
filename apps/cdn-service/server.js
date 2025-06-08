const express = require('express');
const cors = require('cors');
const fs = require('fs');
const fsAsync = fs.promises;
const multer = require('multer');
const path = require('path');
const archiver = require('archiver');
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
const saveEngine = (folderPath)=>{
    const data = fs.readFileSync('./engine.js');
    fs.writeFileSync(path.join(folderPath, 'engine.js'), data);
}
const saveForExport = async (filePath, userId)=>{
     try{
        const data = await fsAsync.readFile(path.join(filePath, 'save.json'), 'utf-8');
        data.replaceAll(`http://localhost:3003/user-${userId}`, '.');
        const temp = "export const scene = " + data; 
        await fsAsync.writeFile(path.join(filePath, 'saved_scene.js'), temp);
     }
     catch (error){
        throw new Error('Ошибка при чтении файла сохранения: ' + error);
     }
}
const createLoadSave = (folderPath)=>{
    try{
        const data = fs.readFileSync('./test.js');
        fs.writeFileSync(path.join(folderPath, 'save.js'), data);
    }
    catch {
        throw new Error("Ошибка создании loadSave.js файла: ");
    }
}
const createHtml = async (folderPath)=>{
    try{
        const data = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="main"></div>
    <script type="module" src="engine.js"></script>
    <script type="module" src="save.js"></script>
</body>

</html>`
        fs.writeFileSync(path.join(folderPath, 'index.html'), data);
    }
    catch{
        throw new Error('Ошибка при создании html документа');
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
app.post('/export', async (req, res)=>{
    const {folderPath, userId} = req.body;
    const dir = path.join(storageDir, folderPath);
    const rootFolderName = folderPath.split('/').filter(Boolean)[1];
    console.log('\n\n' + dir + '\n\n');
    saveEngine(dir);
    await saveForExport(dir, userId);
    createLoadSave(dir);
    createHtml(dir); 
    const archive = archiver('zip', {
        zlib: {level: 9}
    });
    archive.on('error', (err)=>{
        res.status(500).send({error: err.message});
    });
    archive.pipe(res);
    archive.directory(dir, rootFolderName);
    archive.finalize();
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
app.post('/save', (req, res)=>{
    const {userId, title, json} = req.body;
    console.log(json);
    const filePath = path.join(storageDir, `user-${userId}`, title);
    if(fs.existsSync(filePath)){
        fs.writeFileSync(path.join(filePath, "save.json",), JSON.stringify(json));
    }
    return {ok: ''};
})
app.post('/create-project', (req, res)=>{
    const {userId, title} = req.body;
    createProject(userId, title);
    res.status(201).json({ok: "Все у нас прекрасно!"});
})
app.delete('/delete-project/:userId/:title', (req, res) => {
    const { userId, title } = req.params;
    const dir = path.join(storageDir, `user-${userId}`, title);
    fs.rm(path.join(storageDir, `user-${userId}`, title), {recursive: true}, (err)=>{
        if(err){
            console.log('---------------------------------------------');
            console.log(dir);
            console.log(err);
            console.log('---------------------------------------------');
        }
    });
    res.status(200).json({ ok: "Проект удален!" });
});
app.listen(3000, ()=>{
    console.log('Server starts on http://localhost:3000');
})