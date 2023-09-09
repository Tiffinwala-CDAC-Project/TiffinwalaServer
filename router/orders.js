const express = require("express")
const db = require("../db")
const utils = require("../utils");

const router = express.Router()

router.get("/details/:userId", (request, response) => {
  const { userId } = request.params;
  console.log("coming");
  db.query(
    "SELECT Users.name,subscriptions.name, subscriptions.start_date, subscriptions.end_date, orders.totalAmount, subscriptions.description, subscriptions.selectedSubscription, subscriptions.selectedMenu FROM Users JOIN subscriptions ON Users.userId = subscriptions.userId JOIN orders ON subscriptions.userId = orders.userId WHERE Users.userId = ?",
    [userId],
    (error, result) => {  
      response.send(utils.createResult(error, result));
    }
  );
});


router.get("/details/:userId",(request,response)=>
{
    const{userId}=request.params
    console.log("coming");
      db.query("SELECT Users.name,subscriptions.start_date,subscriptions.end_date,orders.totalAmount FROM Users JOIN subscriptions ON Users.userId = subscriptions.userId JOIN orders ON subscriptions.userId = orders.userId WHERE Users.userId = ?",[userId],(error,result)=>{
        response.send(utils.createResult(error, result))
      });
})



// ===========================================================================================
router.post("/insert_order", (request, response) => {
  console.log("insert order");
  const{totalAmount,subscriptionId,userId} = request.body
  db.query("insert into orders(totalAmount,subscriptionId,userId) VALUES (?,?,?)",
  [totalAmount,subscriptionId,userId],(error,result)=>
  {
      response.send(utils.createResult(error, result))  
  }) 
})

    
router.get("/getall", (request, response) => {
    const id = request.params.id
    db.query("SELECT * from orders",(error, result) => {
      response.send(utils.createResult(error, result))
    })
  })

  router.post("/:orderId", (request, response) => {
    const orderId = request.params.orderId
    
    db.query("SELECT * from orders where orderId=?",[orderId],(error, result) => {
      response.send(utils.createResult(error, result))
    })
  })

  router.delete("/:orderId", (request, response) => {
    const orderId = request.params.orderId
    
    db.query("delete  from orders where orderId=?",[orderId],(error, result) => {
      response.send(utils.createResult(error, result))
    })
  })



  // router.get("/:cat", (request, response) => {

  //   const {cat}= request.params

  //   var menu = ""

  //   if(cat === "veg")
  //   {
  //      menu = "Menu A"
  //   }
  //   else if(cat === "nonveg"){

  //     menu = "Menu B"
  //   }

  //   console.log(menu)
  //   db.query("select subscriptions.selectedMenu from orders,subscriptions where orders.subscriptionId=subscriptions.subscriptionId AND subscriptions.selectedMenu= ?",[menu],(error, result) => {
  //     response.send(utils.createResult(error, result))
  //   })
  // })

  router.get("/:cat", (request, response) => {

    const {cat}= request.params

    var menu = ""

    if(cat === "Veg")
    {
       menu = "Menu A"
    }
    else if(cat === "Non-Veg"){

      menu = "Menu B"
    }

    console.log(menu)
    db.query("select count(subscriptions.selectedMenu) from orders,subscriptions where orders.subscriptionId=subscriptions.subscriptionId AND subscriptions.selectedMenu= ?",[menu],(error, result) => {
      response.send(utils.createResult(error, result))
    })
  })

  module.exports = router;