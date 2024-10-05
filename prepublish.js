const readline = require("node:readline");
const package = require("./package.json");
const fs = require("node:fs");
const mdma = require("./index.js");
const version = package.version.split(".");
let update = version;
update[version.length - 1] = parseInt(version[version.length - 1]) + 1;
let packageUpdate = package;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question(
  `Publish as higher version (${package.version} -> ${update.join(
    "."
  )}) ? [y/N]\n`,
  (name) => {
    if (name.toLowerCase() === "y") {
      packageUpdate.version = update.join(".");
      fs.writeFileSync(
        "./package.json",
        JSON.stringify(packageUpdate, null, 2)
      );
    }
    let readme = fs.readFileSync("./readme.md", { encoding: "utf8" });
    let readmeMdma = mdma.new().Parse(readme);

    readmeMdma.headers["version"] = [packageUpdate.version];
    readmeMdma.headers["modified"] = [new Date()];
    readmeMdma.content[1] = `# MDMA v${packageUpdate.version}`;

    fs.writeFileSync("./readme.md", readmeMdma.ToString());
    rl.close();
  }
);
