const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Volunteer = require("../models/volunteer")

//brandon
const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.getAllVolunteers()
        res.json(volunteers)
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error retrieving volunteers")
    }
}

const getVolunteerById = async (req, res) => {
  const volunteerid = req.params.id;
  try {
    const volunteer = await Volunteer.getVolunteerById(volunteerid);
    if (!volunteer) {
      return res.status(404).send("Volunteer not found")
    }
    const volunteerName = volunteer.name; 

    res.json(volunteer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Volunteer");
  }
};


//brandon
const deleteVolunteer = async (req, res) => {
    const volunteerId = req.params.id;
    try {
        const volunteer = await Volunteer.deleteVolunteer(volunteerId);
        if (!volunteer) {
          return res.status(404).send("Volunteer not found");
        }
        res.status(204).send()
    }
    catch(error) {
        console.error(error)
        res.status(500).send("Error deleting volunteer")
    }
}

async function getVolunteerSkills(req, res) {
    const volId = parseInt(req.params.id);
    try {
      const skills = await Volunteer.getVolunteerSkills(volId);
      res.json(skills);
    } catch (error) {
      console.error(error); 
      res.status(500).json({ message: "Error fetching volunteer's skill" });
    }
}

const createVolunteer = async (req, res) => {
  const newVolunteer = req.body;
  try {
      const createdVolunteer = await User.createVolunteer(newVolunteer)
      res.status(201).json(createdVolunteer)
  }
  catch(error) {
      res.status(500).send("Error creating volunteer")
  }
}

async function registerVolunteer(req, res) {
  const { username, password, role } = req.body;
  
  try {
    // Validate user data
    if (password.length < 5) {
      return res.status(400).json({ message: "Password too short" });
    }
    // Check for existing username
    const existingVolunteer = await Volunteer.getVolunteerByName(username);
    if (existingVolunteer) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newVolunteer = {name: username, passwordHash: hashedPassword, role: role}
    const createdVolunteer = await User.createUser(newUser);
    return res.status(201).json({ message: "Volunteer created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Validate user credentials
    const volunteer = await Volunteer.getVolunteerByName(username);
    if (!volunteer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "3600s" }); // Expires in 1 hour

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}


/*
const getBookById = async (req, res) => {
    const bookId = parseInt(req.params.id);
    try {
      const book = await Book.getBookById(bookId);
      if (!book) {
        return res.status(404).send("Book not found");
      }
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving book");
    }
  };



const updateBook = async (req, res) => {
    const bookId = req.params.id;
    const newBookData = req.body;
    try {
        const book = await Book.updateBook(bookId, newBookData);
        if (!book) {
          return res.status(404).send("Book not found");
        }
        
    }
    catch(error) {
        console.error(error)
        res.status(500).send("EError updating book")
    }
}



*/

module.exports = {
    getAllVolunteers,
    getVolunteerById,
    deleteVolunteer,
    getVolunteerSkills,
    createVolunteer,
    registerVolunteer,
    login
}
