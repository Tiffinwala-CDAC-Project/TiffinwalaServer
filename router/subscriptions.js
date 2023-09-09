const express = require("express")
const db = require("../db")
const utils = require("../utils");

const router = express.Router()



router.get("/fetchsubscriptionId/:userId",(request,response)=>
{
    const{userId}=request.params
      db.query("SELECT subscriptionId from subscriptions where userId=?",[userId],(error,result)=>{
        response.send(utils.createResult(error, result))
      });
})

// ==================================================================================================

// API to know user is already subscribed or not

router.get('/check/:userId', (req, res) => {
  const userId = req.params.userId;

  // Query the database to check if a subscription exists for the user
  const sql = `SELECT COUNT(*) AS subscriptionCount FROM subscriptions WHERE userId = ?`;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to check subscription' });
    }

    const subscriptionCount = result[0].subscriptionCount;
    const isSubscribed = subscriptionCount > 0;
    res.status(200).json({ subscribed: isSubscribed });
  });
});


// **************************************************************************************************************************************************************************

router.post('/:userId', (req, res) => {
  const userId = req.params.userId;
  const { name, description, selectedSubscription, start_date, end_date, selectedMenu } = req.body;

  const sql = `INSERT INTO subscriptions (name, description, selectedSubscription, start_date, end_date, selectedMenu, userId) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [name, description, selectedSubscription, start_date, end_date, selectedMenu, userId], (err, result) => {
    if (err) {
      console.error(err); 
      return res.status(500).json({ error: 'Failed to select subscription' });
    }

    // Obtain the last inserted ID (subscriptionId)
    const subscriptionId = result.insertId;

    res.status(200).json({ subscriptionId: subscriptionId, message: 'Subscription selected successfully' });
  });
});


  // **************************************************************************************************************************************************************************

  router.get('/:userId', (req, res) => { 
    const userId = req.params.userId;
  
    
    const sql = `SELECT s.name AS name, s.start_date, s.end_date, DATEDIFF(s.end_date, CURDATE()) AS days_remaining
      FROM subscriptions AS s
      WHERE s.userId = ?`;
  
    
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch subscription details' });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ error: 'User not found or no subscription details found' });
      }
  
      const subscription = result[0];
      const { name, start_date, end_date, days_remaining } = subscription;
  
      res.status(200).json({
        name,
        start_date,
        end_date,
        days_remaining
      });
    });
  });

// **************************************************************************************************************************************************************************
// Endpoint to get the total subscriptions by month
//Get All Subscriptions: An API to get all subscriptions for all users.
//Usefull for Admin purpose

// router.get('/', (req, res) => {
//   // Assuming you have a "subscriptions" table in your database
//   const sql = `
//     SELECT MONTH(start_date) AS month, COUNT(*) AS total_subscriptions
//     FROM subscriptions
//     GROUP BY MONTH(start_date)
//     ORDER BY MONTH(start_date)`;

//   // Execute the SQL query to fetch the total subscriptions by month
//   db.query(sql, (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Failed to fetch total subscriptions by month' });
//     }

//     res.status(200).json(result);
//   });
// });

router.get('/current-month/count', (req, res) => {
  const currentMonth = new Date().getMonth() + 1; // Get current month (1 to 12)
  
  const sql = `
    SELECT COUNT(*) AS total_subscriptions
    FROM subscriptions
    WHERE MONTH(start_date) = ?
  `;
  
  db.query(sql, [currentMonth], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch total subscriptions of the current month' });
    }
    
    res.status(200).json(result[0]);
  });
});

// **************************************************************************************************************************************************************************
//Update Subscription: An API to update the details of an existing subscription.
//Users might want to change their subscription plan, update their selected menu,
//or modify other subscription details.

router.put('/:subscriptionId', (req, res) => {
  const subscriptionId = req.params.subscriptionId;
  const { name, description, selectedSubscription, start_date, end_date, selectedMenu } = req.body;

  const sql = `UPDATE subscriptions SET name=?, description=?, selectedSubscription=?, start_date=?, end_date=?, selectedMenu=? WHERE subscriptionId=?`;

  db.query(sql, [name, description, selectedSubscription, start_date, end_date, selectedMenu, subscriptionId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update subscription' });
    }
    console.log("data updated")

    console.log("Data updated is",name, description, selectedSubscription, start_date, end_date, selectedMenu, subscriptionId)
    res.status(200).json({ message: 'Subscription updated successfully' });
  });
});

// **************************************************************************************************************************************************************************
// Delete Subscription: An API to delete a specific subscription.
//  Users might want to cancel their subscription, and this API allows them to do that.

router.delete('/:subscriptionId', (req, res) => {
  const subscriptionId = req.params.subscriptionId;

  const sql = `DELETE FROM subscriptions WHERE subscriptionId=?`;

  db.query(sql, [subscriptionId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete subscription' });
    }
     console.log("Deleted successfully of userID: ",userId)
    res.status(200).json({ message: 'Subscription deleted successfully' });
  });
});

// **************************************************************************************************************************************************************************
//get all the subscriptions
router.get('/subs/all', (req, res) => {
  const sql = `SELECT * FROM subscriptions`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
    
    res.status(200).json(result);
  });
});

// **************************************************************************************************************************************************************************
//Pause the subscriptions of particular user
router.put('/pause/:subscriptionId', (req, res) => {
  const subscriptionId = req.params.subscriptionId;


  const sql = `UPDATE subscriptions SET isPaused = 1 WHERE subscriptionId = ?`;

  db.query(sql, [subscriptionId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to pause subscription' });
    }

    res.status(200).json({ message: 'Subscription paused successfully' });
  });
});


// **************************************************************************************************************************************************************************
//Resume the subscriptions of particular user

router.put('/resume/:subscriptionId', (req, res) => {
  const subscriptionId = req.params.subscriptionId;


  const sql = `UPDATE subscriptions SET isPaused = 0 WHERE subscriptionId = ?`;

  db.query(sql, [subscriptionId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to resume subscription' });
    }

    res.status(200).json({ message: 'Subscription resumed successfully' });
  });
});

// ======================================================================================================================


// router.get('/orders/count', (req, res) => {
//   const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

//   // Query to get the counts of subscriptions from selected menu until their end date (including the current date)
//   const subscriptionCountsSql = `
//     SELECT selectedMenu, COUNT(*) AS subscriptionCount
//     FROM subscriptions
//     WHERE selectedMenu IN ('veg', 'nonveg', 'hybrid') AND end_date >= ?
//     GROUP BY selectedMenu`;

//   // Execute the query to fetch the subscription counts for each meal type
//   db.query(subscriptionCountsSql, [currentDate], (subscriptionErr, subscriptionResult) => {
//     if (subscriptionErr) {
//       console.error(subscriptionErr);
//       return res.status(500).json({ error: 'Failed to fetch subscription counts' });
//     }

//     const orderCounts = {
//       veg: 0,
//       nonveg: 0,
//       hybrid: 0
//     };

//     // Process the subscription result to update the orderCounts object
//     subscriptionResult.forEach(subscriptionRow => {
//       if (subscriptionRow.selectedMenu === 'veg') {
//         orderCounts.veg = subscriptionRow.subscriptionCount;
//       } else if (subscriptionRow.selectedMenu === 'nonveg') {
//         orderCounts.nonveg = subscriptionRow.subscriptionCount;
//       } else if (subscriptionRow.selectedMenu === 'hybrid') {
//         orderCounts.hybrid = subscriptionRow.subscriptionCount;
//       }
//     });

//     res.status(200).json(orderCounts);
//   });
// });
// ===================================================================================
router.get('/orders/count', (req, res) => {
  const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

  // Query to get the counts   of subscriptions for each meal type and menu type until their end date (including the current date)
  const subscriptionCountsSql = `
    SELECT name, selectedMenu, COUNT(*) AS subscriptionCount
    FROM subscriptions
    WHERE selectedMenu IN ('veg', 'nonveg', 'hybrid') AND end_date >= ? AND start_date <= ?
    GROUP BY name, selectedMenu`;

  // Execute the query to fetch the subscription counts for each meal type and menu type
  db.query(subscriptionCountsSql, [currentDate, currentDate], (subscriptionErr, subscriptionResult) => {
    if (subscriptionErr) {
      console.error(subscriptionErr);
      return res.status(500).json({ error: 'Failed to fetch subscription counts' });
    }

    const orderCounts = {
      lunch: {},
      dinner: {}
    };

    // Initialize the orderCounts object with default values
    ['veg', 'nonveg', 'hybrid'].forEach(menuType => {
      orderCounts.lunch[menuType] = 0;
      orderCounts.dinner[menuType] = 0;
    });

    // Process the subscription result to update the orderCounts object
    subscriptionResult.forEach(subscriptionRow => {
      const mealType = subscriptionRow.name.toLowerCase();
      const menuType = subscriptionRow.selectedMenu;
      const subscriptionCount = subscriptionRow.subscriptionCount;

      // Update the counts for both lunch and dinner
      orderCounts[mealType][menuType] += subscriptionCount;
    });

    res.status(200).json(orderCounts);
  });
});



  module.exports = router;