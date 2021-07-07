// lib and imports
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

require("./config/passport")(passport);

// models
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));
//express session
app.use(session({
  secret : 'secret',
  resave : true,
  saveUninitialized : true
 }));
app.use(passport.initialize());
app.use(passport.session());
 //use flash
 app.use(flash());
 app.use((req,res,next)=> {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error  = req.flash('error');
 next();
 });


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

// to do list methods underneath >>>
// GET
app.get("/todo", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    console.log('hello');
    //   console.log(tasks);
    res.render("todo.ejs", { todoTasks: tasks });
    });
  });

//POST 
app.post('/',async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content
  });
  try {
    await todoTask.save();
    res.redirect("/todo");
  } catch (err) {
    res.redirect("/todo");
  }
});


  //UPDATE
app
.route("/edit/:id")
.get((req, res) => {
  const id = req.params.id;
  TodoTask.find({}, (err, tasks) => {
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
  });
})
.post((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
    if (err) return res.send(500, err);
    res.redirect("/todo");
  });
});

//DELETE
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, err => {
  if (err) return res.send(500, err);
  res.redirect("/todo");
  });
  });



