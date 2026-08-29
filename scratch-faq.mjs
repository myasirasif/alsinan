import { jsonld } from "./app/src/data/jsonld.js";
const walk = (o, out) => { if (Array.isArray(o)) return o.forEach((x) => walk(x, out));
  if (!o || typeof o !== "object") return;
  if (o["@type"] === "Question") out.push(o.name);
  Object.values(o).forEach((v) => walk(v, out)); };
const q = [];
jsonld["/"].forEach((b) => walk(JSON.parse(b), q));
q.forEach((x, i) => console.log(` ${i + 1}. ${x}`));
