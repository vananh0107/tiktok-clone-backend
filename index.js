import express from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import mongoose from 'mongoose';
import morgan from 'morgan';
import router from './routes/index.js'
import 'dotenv/config'
import cors from 'cors';
const corsOptions ={
  origin:'https://tiktok-clone-rouge.vercel.app', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}
const app=express(); 
app.use(express.json())
app.use(express.urlencoded({ extended:false }))
app.use(cookieParser())
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://tiktok-clone-rouge.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
  
});
app.use(express.urlencoded({ extended: true }));
app.use('/api/', router)
const port=process.env.PORT||4000
const server=http.createServer(app)
mongoose.connect(process.env.MONGODB_URL).then(()=>{  
  console.log('Mongodb connected');
  server.listen(port,()=>{
    console.log(`Sever listening on port http://localhost:${process.env.PORT}`);
  })
}).catch(err => {
  console.error(err);
  process.exit(1);
})