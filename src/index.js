// src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetchRouter from './routes/fetch.routes.js';
import connectDB from './db/index.js';

dotenv.config({ path: './.env' });

const app = express();

// Middleware
app.use(cors({
    origin: "https://philmyyshitt.vercel.app/",
    credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use('/api', fetchRouter);
app.get('/', (req, res) => {
    res.send("chal gaya");
});
app.get('/test', (req, res) => {
    res.json({ message: 'pass!' });
});

// Start server
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server: ", error);
        process.exit(1); // Exit with a failure code
    }
};

startServer();

export default app;
