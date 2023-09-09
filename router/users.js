const express = require("express")
const db = require("../db")
const utils = require("../utils")

const router = express.Router()


router.post("/update",(request,response)=>
{
    const{name,email,password,phone,address,area,userId}=request.body
    console.log(name,email,password,phone,address,area,userId);
    console.log("request coming");
    db.query("UPDATE Users set name=?,email=?,password=?,phone=?,address=?,area=? where userId=?",
    [name, email, password, phone, address, area, userId],(error,result)=>
    {
        response.send(utils.createResult(error, result))
     
    })
})

// ======================================================================================

router.post("/register", (request, response) => {
  const { name, email, password, phone, address, area } = request.body
  db.query(
    "INSERT INTO Users(name, email, password, phone, address, area ) VALUES(?,?,?,?,?,?)",
    [name, email, password, phone, address, area ],
    (error, result) => {
      const res = {
        error: error,
        result: result
      }
      res.success = result.affectedRows > 0
      response.send(res)
    }
  )
})

// router.get("/login", (request, response) => {
//   const { email, password } = request.body
//   const statement = "SELECT * FROM Users WHERE email=? and password=?"
//   db.query(statement, [email, password], (error, result) => {
//     response.send(utils.createResult(error, result))
//   })
// })


router.post("/login", (request, response) => {
  const { email, password } = request.body;
  const statement = "SELECT * FROM Users WHERE email=? AND password=?";
  db.query(statement, [email, password], (error, result) => {
    if (error) {
      response.send(utils.createResult(error));
    } else {
      if (result.length > 0) {
        // Login successful
        const user = result[0];
        response.send(utils.createResult(null, user.userId)); // Sending only userId
      } else {
        // Invalid credentials
        response.send(utils.createResult("Invalid credentials"));
      }
    }
  });
});


router.get("/:Userid", (request, response) => {
  const Userid = request.params.Userid
  const statement = `SELECT * FROM Users WHERE Userid=?`
  db.query(statement, [Userid], (error, result) => {
    response.send(utils.createResult(error, result))
  })
})

router.get("/", (request, response) => {
  const statement = "SELECT * FROM Users";
  db.query(statement, (error, result) => {
    response.send(utils.createResult(error, result));
  });
});

router.delete("/delete/:userId", (request, response) => {
  const userId = request.params.userId;
  const Statement = "SELECT * FROM Users WHERE userId=?";
  db.query(Statement, [userId], (error, result) => {
    if (error) {
      response.send(utils.createResult(error));
    } else if (result.length === 0) {
      response.send(utils.createResult("User not found"));
    } else {
      // User exists, proceed with deletion
      const deleteUserStatement = "DELETE FROM Users WHERE userId=?";
      db.query(deleteUserStatement, [userId], (error, result) => {
        if (error) {
          response.send(utils.createResult(error));
        } else {
          response.send(utils.createResult(null, "User deleted successfully"));
        }
      });
    }
  });
});

module.exports = router