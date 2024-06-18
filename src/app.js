import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express(); 

// CORS
app.use(cors({
    origin:["https://philmyyshitt.vercel.app"],
    methods:["POST","GET"],
    credentials:[true]
}))

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