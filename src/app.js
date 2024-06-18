import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express(); 

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://philmyyshitt.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

// Other middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import fetchRouter from './routes/fetch.routes.js';
import userRouter from './routes/user.routes.js';

// Routes Declaration
//ROutes Decalarion

app.use('/api', fetchRouter);
app.use('/user',userRouter);
app.use('/', (req, res) => {
    res.json("Hello World");
});

export default app;