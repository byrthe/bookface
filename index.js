// lib and imports
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const router = express.Router();
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');

// models
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

// db connect (todo list snippet)
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
console.log("Connected to db!");
app.listen(3000, () => console.log("Server Up and running"));
});

// mongoose (login authentication snippet)
// mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true, useUnifiedTopology : true})
// .then(() => console.log('connected,,'))
// .catch((err)=> console.log(err));


// EJS
app.set("view engine", "ejs");
app.use(expressEjsLayout);

//BodyParser
app.use(express.urlencoded({extended : false}));

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


// GET
// app.get("/", (req, res) => {
//   TodoTask.find({}, (err, tasks) => {
//     console.log('hello');
//   //   console.log(tasks);
//   // res.render("todo.ejs", { todoTasks: tasks });
//   });
//   });

// //POST 
// app.post('/',async (req, res) => {
//   const todoTask = new TodoTask({
//   content: req.body.content
//   });
//   try {
//   await todoTask.save();
//   res.redirect("/");
//   } catch (err) {
//   res.redirect("/");
//   }
//   });


//   //UPDATE
// app
// .route("/edit/:id")
// .get((req, res) => {
// const id = req.params.id;
// TodoTask.find({}, (err, tasks) => {
// res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
// });
// })
// .post((req, res) => {
// const id = req.params.id;
// TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
// if (err) return res.send(500, err);
// res.redirect("/");
// });
// });

// //DELETE
// app.route("/remove/:id").get((req, res) => {
//   const id = req.params.id;
//   TodoTask.findByIdAndRemove(id, err => {
//   if (err) return res.send(500, err);
//   res.redirect("/");
//   });
//   });



