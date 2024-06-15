import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";


if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: './.env' });
  }

connectDB()
.then(()=>{
    
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((e) => {
    console.error("MongoDB connection error : ",e);
    
});
app.get('/test', (req, res) => {
    res.json({ message: 'pass!' });
});