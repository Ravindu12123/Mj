const { File } = require("megajs");
const fs = require("fs");
const path = require("path");
const express= require("express");
const app = express();
const axios= require("axios");
const FormData=require("form-data");
const cors = require("cors");
const megaC= require('mega-link-checker')
const bodyParser = require('body-parser');
const bot = require("./tg");
const BOT_TOKEN = process.env.Token;
const channel=process.env.channel;
const owner=process.env.Owner;

var run=0;stopn=0;
var filetypes={jpg:"image",png:"image",gif:"image",jpeg:"image",svg:"image",bmp:"image",tiff:"image",ico:"image",webp:"image",mp4:"video",mp3:"audio",mkv:"video",webm:"video",flv:"video",avi:"video",mov:"video",MOV:"video"};
var sizelimits={M20:20971520,M50:52428800,M100:104857600,};
var timingsSleep=process.env.ts==null ? 1000:process.env.ts;
var dlp=process.env.dlp==null ? "download":process.env.dlp;
var smethod={image:{method:"sendPhoto",name:"photo"},video:{method:"sendVideo",name:"video"},document:{method:"sendDocument",name:"document"},audio:{method:"sendAudio",name:"audio"}};
var sfilesjson='./files.json';
var Afilesjson='./Allfiles.json';

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//Mjs cust..
File.defaultHandleRetries = (tries, error, cb) => {if (tries > 8)  {cb(error);} else {setTimeout(cb, 1000 * Math.pow(2, tries));}};

app.get("/",(req,res)=>{
  res.send("Hello World");
})

var fl=[];fll=[];erfiles=[];var follf;

function SizeF(a,b=2){if(!+a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return`${parseFloat((a/Math.pow(1024,d)).toFixed(c))} ${["Bytes","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"][d]}`}
const sleepf = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
function pres(per, tot) {
    p=Number(per);t=Number(tot);
    return ((p / t) * 100).toFixed(2)
}

function cleardl(){
  directory=path.join(__dirname,dlp);
  fs.readdir(directory, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    fs.unlink(path.join(directory, file), 
      (err) => {
      if (err) throw err;}); }});
}

async function stopPros(){
   console.log("Pros-stopped!!!!");
    await cleardl();
    bot
      .telegram
      .sendMessage(owner,"process stoped!🙂\nBy You via Func☝️");
    stopn=0;
    run=0;
}

const replacerFunc = () => {
  const visited = new WeakSet();
  return (key, value) => {
     if (typeof value === "object" && value !== null) {
       if (visited.has(value)) { return;}visited.add(value);
       if(value.constructor!=null){
         if(value.constructor.name=="_File" && value.directory==false){
           var {name,size,downloadId,key}=value;
           typex=filetypes[name.split(".").pop()];
           so={
             name:name,
             size:size,
             downloadId:downloadId,
             key:key,
             type:typex ? typex : "document",
           };
           if(so.type == "video" && so.size < sizelimits.M50 && so.size > 0){
             fl.push(so);
           }
           if(so.size<=0){
             erfiles.push(so);
           }
           fll.push(so);
         }
       }
     }
    return value;
  };
};

async function sendV(obj,res){
 formData = new FormData();
 formData.append('chat_id',channel);
formData.append('video',await fs.createReadStream(path.resolve(obj.fp)));
formData.append('caption',`${obj.file.counter.cr}. ${obj.file.name}`);response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, formData, {headers:{'Content-Type': 'multipart/form-data'},data:formData});
    return response.data.ok;
}

async function sendImg(obj,res){
 formData = new FormData();
 formData.append('chat_id',channel);
formData.append('photo',await fs.createReadStream(path.resolve(obj.fp)));
formData.append('caption',`${obj.file.counter.cr}. ${obj.file.name}`);response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, formData, {headers:{'Content-Type': 'multipart/form-data'},data:formData});
    return response.data.ok;
}

async function sendT(obj,res){
 formData = new FormData();
 formData.append('chat_id',channel);
formData.append('document',await fs.createReadStream(path.resolve(obj.fp)));
formData.append('caption',`${obj.file.counter.cr}. ${obj.file.name}`);response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, formData, {headers:{'Content-Type': 'multipart/form-data'},data:formData});
    return response.data.ok;
}

async function dl(did,fobj,crobj){
 return new Promise(async (res,rej)=>{
  fol = File.fromURL(flu=follf+"/file/"+did[1]);
  await fol.loadAttributes(async (error, ff) => {
  var ffpp=path.join(__dirname,dlp,ff.name);
    Ff=ff;
    ff.counter=crobj;
  console.log(`doing: ${ff.name}-${crobj.cr} of ${crobj.t}`);
  fzz=await SizeF(ff.size);
  msg1=await bot.telegram.sendMessage(owner,`Downloading:- ${crobj.cr} of ${crobj.t} \n\n${ff.name} \nSize:- ${fzz}`);
  stream= ff.download();
  stream.on('error', async (error) => {
    console.error(error);
    await bot.telegram.sendMessage(owner,`Err - ${error}`);
  })
  stream.on('progress', async (info) => {
  console.log(info.bytesLoaded,"/",info.bytesTotal);
  if(info.bytesLoaded==info.bytesTotal){
  //  setTimeout(async ()=>{
      gjesuw=await sleepf(50);
      let start = fs.statSync(ffpp).size;
      fzs=await SizeF(start);
      console.log('now File size Is '+fzs);
      if(start<info.bytesLoaded){
         console.log("but file not filled\nTrying to fill It");
         ff.download({ start }).pipe(fs.createWriteStream(ffpp, {flags: 'r+',start}));
      }
      sleepsde=await sleepf(50);
      start = fs.statSync(ffpp).size;
      fzs=await SizeF(start);
      console.log('now File size Is '+fzs);
      if(start==info.bytesLoaded){
         console.log("dl done");
         msg1=await bot.telegram.editMessageText(owner,msg1.message_id,null,`${ff.name} -Downloaded! Now Uploading!💪`);
         nnf=await sleepf(50);var rr;
         if(fobj.type=="image"){
           rr=await sendImg({fp:ffpp,file:ff});
         }else if(fobj.type=="video" && fobj.size < sizelimits.M20){
           rr=await sendV({fp:ffpp,file:ff});
         }else{
           rr=await sendT({fp:ffpp,file:ff});
         }
         if(rr==true){
            fs.unlinkSync(ffpp);
            await bot.telegram.deleteMessage(owner,msg1.message_id);
         }else{
            console.log("error on send-",ffpp);
            console.log(rr);
            await bot.telegram.sendMessage(owner,'Err on sending');
         }
         res(rr);
      }else{
        console.log("err on dl");
        await cleardl();
        timingS();
      }
// },50);
  }});
   stream.pipe(fs.createWriteStream(ffpp));
  })
}) 
}

/*Skipping current file*/
async function skipts(msg){
  if(stopn==0){
    if(fs.existsSync(sfilesjson)){
    data= fs.readFileSync(sfilesjson).toString();
    obj = JSON.parse(data);
    if(obj.files.length>=1){
      file=obj.files.shift();
      obj.total=obj.files.length;
      obj.current+=1;
      str=`skiped this file:-\n\n`;
      for(key in file){
         v=file[key];
         str+=`   🔰${key} : ${v}\n`;
      }
      await bot.telegram.editMessageText(owner,msg.message_id,null,str);
      console.log("done",x);
      fs.writeFileSync(sfilesjson,JSON.stringify(obj));
      setTimeout(timingS,timingsSleep);
    }else{
      console.log("no files");
      await bot.telegram.editMessageText(owner,msg.message_id,null,"Process finished!!😇\nSo no files to skip!!!");
      run=0;
    }
    }else{
      await bot.telegram.editMessageText(owner,msg.message_id,null,"No source file!");
    }
  }else{
    console.log("stopped!!!!");
    await cleardl();
    bot.telegram.sendMessage(owner,"process stoped!🙂\nBy You@");
    stopn=0;
    run=0;
  }
}
    
async function timingS(){
  if(stopn==0){
  if(fs.existsSync(sfilesjson)){
  data= fs.readFileSync(sfilesjson).toString();
  obj = JSON.parse(data);
  if(obj.files.length>=1){
    file=obj.files.shift();
    obj.current+=1;
    x=await dl(file.downloadId,file,{cr:obj.current,t:obj.total});
    if(x==true){
      console.log("done",x);
      fs.writeFileSync(sfilesjson,JSON.stringify(obj));
      setTimeout(timingS,timingsSleep);
    }else{
      console.log("error on send");
      fs.writeFileSync(sfilesjson,JSON.stringify(obj));
      setTimeout(timingS,timingsSleep);
    }
  }else{
    console.log("no files");
    await bot.telegram.sendMessage(owner,"Process finished!!😇");
    run=0;
  }
  }else{
    await bot.telegram.sendMessage(owner,"No source file!");
  }
  }else{
    console.log("stopped!!!!");
    await cleardl();
    bot.telegram.sendMessage(owner,"process stoped!🙂\nBy You@");
    stopn=0;
    run=0;
  }
}

/*skipping some count of files from start using index...*/
async function skipind(msg,ind){
 if(fs.existsSync(sfilesjson)){
  data= fs.readFileSync(sfilesjson).toString();
  obj = JSON.parse(data);
  if(obj.files.length>=ind){
    skfiles=obj.files.splice(0,ind);
    obj.current=0;
    obj.total=obj.files.length;
    str=`Skipped ${ind} files\n now you can send /ts to run me!`;
    await bot.telegram.editMessageText(owner,msg.message_id,null,str);
    console.log("done",x);
    fs.writeFileSync(sfilesjson,JSON.stringify(obj));
  }else{
    str=`no file above that amout\nI have only ${obj.files.length} files to send.\nplease try lower number🙃`;
    await bot.telegram.editMessageText(owner,msg.message_id,null,str);
  }
 }else{
    await bot.telegram.editMessageText(owner,msg.message_id,null,'No source file!');
 }
}


async function loadMega(url) {
  run=1;follf=url;
  const folder = File.fromURL(url);obj={files:[]};
  await folder.loadAttributes();
  h=JSON.stringify(folder, replacerFunc());
  fg=fl.find(e=>e.size<=sizelimits.M50);
  console.log(folder.children.length);
  fs.writeFileSync(sfilesjson,JSON.stringify({
    files:fl,
    current:0,
    total:fl.length
  }));
  fs.writeFileSync(Afilesjson,JSON.stringify({files:fll}));
  
  console.log(ctext=fll.length+" of files founded!\n and  "+fl.length+" of them can be uploaded to telegram\nAnd "+erfiles.length+" of files are not files they are errored!");
  rt=`This is the Total extracted files from the link ${fl.length} of files I will send ${fg.length} files now`;
  spa=path.join(__dirname,Afilesjson);
  await bot.telegram.sendDocument(owner,{source:spa});
  await bot.telegram.sendMessage(owner,ctext);
  run=1;
  timingS();
}

app.listen(3000,()=>{
  setTimeout(async ()=>{
  console.log("server started!");
  ddlp=path.join(__dirname,dlp);
  if (!fs.existsSync(ddlp)){
    fs.mkdirSync(ddlp);
    console.log("download path created!");
  }else{
    console.log("download path exists!");
    await cleardl();
    console.log("cleared dl path!");
  }
//ll="https://mega.nz/folder/2IlUSQwA#bMIrsQnNZtN5H6D2kcB_rA";
    /*console.log(await megaC(ll));;
    loadMega(ll);*/
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  if(ctx.message.chat.id == owner){
  if(text =='/stop'){
    if(run==1){
      stopn=1;
      ctx.reply('Trying to  stop!!!🫡');
    }else{
      ctx.reply('Alredy stopped!😅');
    }
  }else if(text == '/rerun'){
    if(run==0){
      run=1;
      timingS();
    }else{
      ctx.reply('Alredy running😅!');
    } 
  }else if(text == '/run0'){
    stopn=0;
    run=0;
    await cleardl();
    ctx.reply('runnig var set to 0\nand download path cleared');
  }else if(text == '/ts'){
    ctx.reply('Trying to run timingS Func');
    if(run==0){
       run=1;
    }
    timingS();
  }else if(text == '/isf'){
    dirCont = fs.readdirSync( ddlp );
    files = dirCont.filter( ( elm ) => elm.match(/.*\.(mp4?)/ig));
    files = files.map(async (elm)=>{
      pt=path.join(ddlp,elm);
      siz = fs.statSync(pt).size;
      fzs=await SizeF(siz);
      console.log('now File size Is '+fzs);
      return elm+' size: '+fzs;
    })
    str=files.join('\n');
    await ctx.reply(`Found this files:-\n ${str}`);
  }else if(text == '/skipF'){
    msss=await ctx.reply('Trying to skip current File!**');
    x=await skipts(msss);
  }else if(text == '/numF'){
    if(fs.existsSync(sfilesjson)){
      data= fs.readFileSync(sfilesjson).toString();
      obj = JSON.parse(data);
      count=obj.files.length;
      await ctx.reply(`${count} of files reming\n${obj.current} / ${obj.total}-Now stats`);
    }else{
      await ctx.reply('No source file!😐');
    }
  }else if(text.includes('sk--')==true){
    ind=Number(text.split('--')[1]);
    mzzz=await ctx.reply(`Trying to skip ${ind} of files!🫡`);
    await skipind(mzzz,ind);
  }else{
    mc=await megaC(text);
    if(mc==true){
      await ctx.reply('Thats a valid link\nWorking!....');
      if(run==0){
        run=1;
        loadMega(text);
      }else{
        ctx.reply('I am alredy in a process!');
      }
    }else{
      ctx.reply('Give me a valid Mega link!😇');
    }
  }
  }else{
    ctx.reply('Sorry I am private Bot🙃');
  }
});
    },3000);
})

