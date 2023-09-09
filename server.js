const express = require("express")
const cors = require("cors")
const routerUser = require("./router/users")
const routerSubscriptions = require("./router/subscriptions")
const routerOders = require("./router/orders")
const routerList = require("./router/meallist")
const routerweeklyMenu = require("./router/mealweeklymenu")

const app = express()
app.use(express.json())
app.use(cors("*"))
app.use("/Users", routerUser)
app.use("/subscriptions", routerSubscriptions)
app.use("/orders", routerOders)
app.use("/mealist", routerList)
app.use("/weeklymenu",routerweeklyMenu )

app.use(express.static('uploads'))

app.listen(4000, "0.0.0.0", () => {
  console.log("Server started at port 4000")
})


