<!--
MDMA/1.0
title: "About MDMA"
author: "Zapto"
created: 2024-10-03T19:18:13.000Z
modified: 2024-10-05T13:51:47.784Z
version: "1.0.2"
-->

# MDMA v1.0.2

Markdown Meta Annotations NPM package

## Idea

I started creating this project because i wanted to do a blog using markdown, tho i wanted to store the blog posts as text files, so i needed a way to add metadata to markdown.
So this idea was borned!

At first i want to make it work like HTTP headers tho it would be nice if the markdown would be retro compatible, both ways.
That's why i use HTML comment blocks to contain the metadata. It's probably not compatible with every markdown renderer, but it's compatible with GitHub and for me it's enough.

Feel free to make other renderers compatible, tho for me no renderer should show HTML comments anyway.

## How to install

`npm i mdma@latest`

## Usage

### parse a file

```js
const mdma = require("mdma");
let myMDMA = mdma.new();

let markdown = fs.readFileSync("./readme.md", { encoding: "utf8" }); //this can be any markdown

myMDMA.Parse(markdown);

console.log(`The file : \n${myMDMA.ToString()}`);

console.log(`Title : ${myMDMA.GetTitle()}`);
console.log(`Author : ${myMDMA.GetAuthor()}`);
console.log(`Created : ${myMDMA.GetCreated()}`);
console.log(`Modified : ${myMDMA.GetModified()}`);

console.log(`Content : \n${myMDMA.GetContent()}`);
```

### create a file

```js
const mdma = require("mdma");
let myMDMA = mdma.new();

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
```
