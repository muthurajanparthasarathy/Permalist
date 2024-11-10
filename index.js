import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const db = new pg.Client({
  host: "localhost",
  database: 'permalist',
  user: 'postgres',
  password: '123$%^qweRTY',
  port: 5432
})
let items = [];
// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

db.connect();




app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC");
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  console.log(item)
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);

  }
  catch (err) {
    console.log(err);

  }

  // items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", async (req, res) => {

  try {
    await db.query("UPDATE items SET title = $1 where id = $2", [req.body.updatedItemTitle, parseInt(req.body.updatedItemId)]);


  }
  catch (err) {
    console.log(err);

  }
  res.redirect("/");



});

app.post("/delete", async (req, res) => {
  console.log(req.body.deleteItemId)

  try {
    await db.query("DELETE FROM  items WHERE id = $1", [parseInt(req.body.deleteItemId)]);

  }
  catch (err) {
    console.log(err);

  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
