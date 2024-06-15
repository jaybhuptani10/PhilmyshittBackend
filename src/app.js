import express from 'express';
import cors from 'cors';

const app = express(); 


//Routes
import fetchRouter from './routes/fetch.routes.js';

//ROutes Decalarion

app.use('/api', fetchRouter);
app.use('/', (req, res) => {
    res.send("Hello World");
});
export default app;