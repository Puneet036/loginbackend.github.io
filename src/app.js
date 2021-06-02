const express = require("express");
const path =require("path");
const app = express();
const hbs = require("hbs");

require("./db/conn");
const Register =require("./models/userregister")


const port = process.env.PORT || 3000;

const static_path =path.join(__dirname, "../public");
const template_path =path.join(__dirname, "../templates/views");
const partial_path =path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views",template_path);
hbs.registerPartials(partial_path);

app.get("/register",(req,res) =>{
    res.render("register");
});
app.get("/login",(req,res)=>{
        res.render("login");
});

//Create a new user database
app.post("/register",async (req,res) =>{
    try {
        const password =req.body.password;
        const cpassword =req.body.confirmpassword;

        if(password===cpassword){
                    const registerEmployee = new Register({

                        firstname:req.body.firstname,
                        lastname:req.body.lastname,
                        password:password,
                        confirmpassword:cpassword,
                        gender:req.body.gender,
                        email:req.body.email
                        
                    })
                    const registered =await registerEmployee.save();
                    res.status(201).render("register");
        }else{
            res.send("password are not mattching")
        }

    } catch (error) {
        res.status(400).send(error);
    }
});

//login check
app.post("/login",async (req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
       const useremail =await Register.findOne({email:email})
        
       if(useremail.password=== password){
           res.status(201).render("login");
       }else{
           res.send("invalid login details");//
       }

    } catch (error) {
        res.status(400).send("invalid login details");
    }
});

app.listen(port, () => {
    console.log(`server is running at port ${port} `);
});