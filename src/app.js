import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express(); 

// CORS
const corsOptions = {
    origin: ['https://philmyyshitt.vercel.app'],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
    credentials: true,
    enablePreflight: true
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions))

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