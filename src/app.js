import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express(); 

// CORS
const corsOptions = {
    origin: ["https://philmyyshitt.vercel.app", "http://localhost:5173"],
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

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