const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser")
const volunteercontroller = require("./controllers/volunteercontroller")
const ngocontroller = require("./controllers/ngocontroller")

const app = express()
const port = process.env.PORT || 3000;
const staticMiddleware = express.static("public"); // Path to the public folder
// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(staticMiddleware)   

//volunteers
app.get("/volunteers", volunteercontroller.getAllVolunteers);
app.delete("/volunteers/:id", volunteercontroller.deleteVolunteer);
app.get("/volunteers/skills/:id", volunteercontroller.getVolunteerSkills);

//NGOs
app.get("/ngos", ngocontroller.getAllNGOs);
app.get("/ngos/status/:status", ngocontroller.getNGOsByStatus); //status must be R, A or P
app.get("/ngos/:id", ngocontroller.getNGOById);
app.put("/ngos/:id", ngocontroller.updateNGO)
app.patch("/ngos/:id/:status", ngocontroller.updateNGOStatus)
app.delete("/ngos/:id", ngocontroller.deleteNGO);
app.post("/volunteer", volunteercontroller.createVolunteer)



app.listen(port, async() => {
    try {
        await sql.connect(dbConfig);
        console.log("Database connection success")
    }
    catch (err) {
        console.error("Database connection error", err)
        //terminate process
        process.exit(1);
    }

    console.log(`Server listening on port ${port}`)
})

process.on("SIGINT", async() => {
    console.log("Server shutting down gracefully")
    //clean up tasks
    await sql.close()
    console.log("Database connection closed")
    process.exit(0) //code 0 is successful shutdown
})


