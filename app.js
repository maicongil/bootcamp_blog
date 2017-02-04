var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    app = express()
    port = process.env.PORT || 8080;

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

var blogSchema = mongoose.Schema({
        title : String,
        image : String,
        body : String,
        created : {type : Date, default : Date.now}
    });

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(error, blogs){
        if(error){
            console.log(error);
        }else{
            res.render("index", {blogs : blogs});
        }
    });
});

app.get("/blogs/new", function(req, res){
    res.render("new");
});


app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(error, blog){
        if(error){
            console.log(error);
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(error, blog){
        if(error){
            console.log(error);
            res.redirect("/blogs");
        }else{
            res.render("show", {blog : blog});
        };
    });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(error, blog){
        if(error){
            console.log(error);
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog : blog});
        };
    });
});

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(error, blog){
        if(error){
            console.log(error);
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + blog._id);
        }
    });
});

app.listen(port, function(){
    console.log("Server is listening at port: "+port);
});
