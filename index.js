// lib and imports
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const {ensureAuthenticated} = require("./config/auth.js")


require("./config/passport")(passport);

// models
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser('secret'));

//express session
app.use(session({
  secret : 'secret',
  resave : true,
  saveUninitialized : true,
  cookie: { maxAge: 60000 }
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

// trying to up the to do list on the dashboard page >>>
// GET
app.get("/dashboard", ensureAuthenticated, (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    console.log('hello on the dashboard');
      console.log(tasks);
      res.render("dashboard", { todoTasks: tasks, user: req.user });
    }).sort({$natural:-1});
  });

//POST 
// app.post("dashboard", async (req, res) => {
//   console.log('Got body:', req.body);
//   const todoTask = new TodoTask({
//     content: req.body.content
//   });
//   console.log('hello from the POST');
//   try {
//     await todoTask.save();
//     console.log('managed to save to the db');
//     res.redirect("/dashboard");
//   } catch (err) {
//     console.log('big error!');
//     res.redirect("/dashboard");
//   }
// });

//previously working code without the user included in the post:
// //POST 
// app.post('/',async (req, res) => {
//   // console.log(req.body.content)
//   const todoTask = new TodoTask({
//   content: req.body.content
//   });
//   try {
//   await todoTask.save();
//   res.redirect("/dashboard");
//   } catch (err) {
//   res.redirect("/dashboard");
//   }
// });

// jacopo's edit to add the user to the post
app.post('/', async (req, res) => {
  try {
    const todoTask = new TodoTask({ 
      content: req.body.content
    });
    
    todoTask.author = req.user.name;
    await todoTask.save();
    req.flash('success', 'Post succefully created');
    res.redirect('/dashboard');
  } catch (err) {
    req.flash('error', err);
  }
})

  // UPDATE
app
.route("/edit/:id")
.get((req, res) => {
  const id = req.params.id;
  console.log(id)
  TodoTask.find({}, (err, tasks) => {
    res.render("dashboardEdit", { todoTasks: tasks, idTask: id, user: req.user });
  }).sort({$natural:-1});;
})
.post((req, res) => {
  const id = req.params.id;
  console.log(id)
  TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
    if (err) return res.send(500, err);
    res.redirect("/dashboard");
  });
});

//DELETE
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, err => {
  if (err) return res.send(500, err);
  res.redirect("/dashboard");
  });
});







//   // to do list methods underneath >>>
// // GET
// app.get("/todo", (req, res) => {
//   TodoTask.find({}, (err, tasks) => {
//     console.log('hello');
//     //   console.log(tasks);
//     res.render("todo.ejs", { todoTasks: tasks });
//     });
//   });

// //POST 
// app.post('/',async (req, res) => {
//   const todoTask = new TodoTask({
//     content: req.body.content
//   });
//   try {
//     await todoTask.save();
//     res.redirect("/todo");
//   } catch (err) {
//     res.redirect("/todo");
//   }
// });

// //UPDATE
// app
// .route("/edit/:id")
// .get((req, res) => {
//   const id = req.params.id;
//   TodoTask.find({}, (err, tasks) => {
//     res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
//   });
// })
// .post((req, res) => {
//   const id = req.params.id;
//   TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
//     if (err) return res.send(500, err);
//     res.redirect("/todo");
//   });
// });

// //DELETE
// app.route("/remove/:id").get((req, res) => {
//   const id = req.params.id;
//   TodoTask.findByIdAndRemove(id, err => {
//   if (err) return res.send(500, err);
//   res.redirect("/todo");
//   });
// });



