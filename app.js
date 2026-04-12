import { products } from "./data/products.js";
import { dangerDB } from "./data/dangerDB.js";
import { pictogrammes } from "./data/pictogrammes.js";
import { save, load } from "./modules/storage.js";

let data = load() || products;

function init() {
  renderTable(data);
  fillDangerOptions();
}

function addProduct(p) {
  data.push(p);
  save(data);
  renderTable(data);
}
