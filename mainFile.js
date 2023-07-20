let express =require("express");
let app = express();
app.use(express.json());
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With,Content-Type,Accept"
    );
    next();
})
var port=process.env.PORT||2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));

let {customersData}=require("./customerData.js");
let fname="customersData.json";
let fs=require("fs");
let readline=require("readline-sync");

app.get("/resetData",function(req,res){
    let str=JSON.stringify(customersData);
    fs.writeFile(fname,str,function(err){
        if(err) res.status(404).send(err);
        else{
            res.send("Data in file is reset");
        }
    })
})

app.get("/customers",function(req,res){
    fs.readFile(fname,"utf8",function(err,data){
        if (err) res.status(404).send(err);
        else{
            let obj=JSON.parse(data);
            res.send(obj);
        }
    })
});

app.post("/customers",function(req,res){
    let body=req.body;
    fs.readFile(fname,"utf8",function(err,data){
        if (err) res.status(404).send(err);
        else{
            let obj=JSON.parse(data);
            let newCustomer={...body};
            obj.push(newCustomer);
            let data1=JSON.stringify(obj);
            fs.writeFile(fname,data1,function(err){
                if(err) res.status(404).send(err);
                else res.send(newCustomer);
            })
        }
    })
})

app.put("/customers/:id",function(req,res){
    let id=req.params.id;
    let body=req.body;
    fs.readFile(fname,"utf8",function(err,data){
        if (err) res.status(404).send(err);
        else{
            let obj=JSON.parse(data);
            let index = obj.findIndex((st) => st.id === id);
            if (index >= 0){
                let updatedCustomer={...body};
                obj[index]=updatedCustomer;
                let data1 = JSON.stringify(obj);
                fs.writeFile(fname, data1, function (err) {
                  if (err) res.status(404).send(err);
                  else res.send(updatedCustomer);
                });
            }
            else{
                res.status(404).send("No Customer Found")
            }
        }
    })
})

app.delete("/customers/:id",function(req,res){
    let id=req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if (err) res.status(404).send(err);
        else{
            let obj=JSON.parse(data);
            let index = obj.findIndex((st) => st.id === id);
            if (index >= 0){
                let deletedStudent = obj.splice(index, 1);
                let data1 = JSON.stringify(obj);
                fs.writeFile(fname, data1, function (err) {
                  if (err) res.status(404).send(err);
                  else res.send(deletedStudent);
                });
            }
            else{
                res.status(404).send("No Customer Found")
            }
        }
    })
})