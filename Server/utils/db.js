import mysql from "mysql2"
const con = await mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Siva413?",
    database:"employeems"
})

con.connect(function(err){
if(err){
    console.log("Connection Error")}
else{
    console.log("Connected Successfully")
}})

export default con