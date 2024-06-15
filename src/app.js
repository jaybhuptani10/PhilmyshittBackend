import express from 'express';
import cors from 'cors';

const app = express(); 
app.use(cors(
    {
        origin: ["https://philmyyshitt.vercel.app/","http://localhost:5173/"]  ,
        credentials: true,
       
    
    }
));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

//Routes
import fetchRouter from './routes/fetch.routes.js';

//ROutes Decalarion

app.use('/api', fetchRouter);
app.use('/', (req, res) => {
    res.send("Hello World");
});
export default app;