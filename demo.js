const mdma = require("./index.js"); //you should use require("mdma") for your application
const fs = require("node:fs");

let myMDMA = mdma.new();

let markdown = fs.readFileSync("./readme.md", { encoding: "utf8" }); //this can be any markdown

myMDMA.Parse(markdown);

console.log(`The file : \n${myMDMA.ToString()}`);

console.log(`Title : ${myMDMA.GetTitle()}`);
console.log(`Author : ${myMDMA.GetAuthor()}`);
console.log(`Created : ${myMDMA.GetCreated()}`);
console.log(`Modified : ${myMDMA.GetModified()}`);

console.log(`Content : \n${myMDMA.GetContent()}`);

myMDMA = mdma.new();

myMDMA.SetTitle("My New MDMA post");
myMDMA.SetAuthor("Myself");
myMDMA.SetCreated(new Date());
myMDMA.SetContent(
  "This MDMA file was generated directly from code!\nIsn't this neat?\r\nAlso '\\r\\n' are automatically transformed to '\\n'"
);

console.log(`The file : \n${myMDMA.ToString()}`);

console.log(`Title : ${myMDMA.GetTitle()}`);
console.log(`Author : ${myMDMA.GetAuthor()}`);
console.log(`Created : ${myMDMA.GetCreated()}`);
console.log(`Modified : ${myMDMA.GetModified()}`);

console.log(`Content : \n${myMDMA.GetContent()}`);
