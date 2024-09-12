const express = require("express");

const app = express();
const PORT = 5000;
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');




app.use(bodyParser.json());
//データベース接続
mongoose.connect(
    "mongodb://localhost:27017/"
).then(() => {
    console.log("DBと接続中・・・");
})
.catch((err) => {
    console.log(err);
});
//ミドルウェア

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);

app.get("/", (req,res)=>{
    res.send("shihoshihoshiho");
});

// app.get("/users", (req,res)=>{
//     res.send("shihoshihoshihoshihoshiho");
// })

app.listen(PORT, () => console.log("サーバーが起動しました"));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
