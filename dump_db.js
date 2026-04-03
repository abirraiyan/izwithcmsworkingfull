import Database from "better-sqlite3";
const db = new Database("database.sqlite");
const items = db.prepare("SELECT id, name, image_url FROM menu_items").all();
console.log(JSON.stringify(items, null, 2));
