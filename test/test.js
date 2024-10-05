const mdma = require("../index");

const testData = `
<!--
MDMA/1.0
title: "Document Title"
author: "Author Name"
created: 2024-10-03T14:30:45
modified: 2024-10-04T09:15:22
version: 1
custom-metadata: "Custom Value"
multi-Line: "Multi
Line
Support"
colon: "Colon Support: True"
multi-header-support : True
header-with-quotes : ""test""
multi-header-support : false
-->
# Content Title

Your markdown content goes here.
`;

const expectedData = {
  version: "1.0",
  headers: {
    title: ["Document Title"],
    author: ["Author Name"],
    created: [Date.parse("2024-10-03T14:30:45")],
    modified: [Date.parse("2024-10-04T09:15:22")],
    version: [1],
    "custom-metadata": ["Custom Value"],
    "multi-line": ["Multi\nLine\nSupport"],
    colon: ["Colon Support: True"],
    "multi-header-support": [true, false],
    "header-with-quotes": ['"test"'],
  },
  content: "# Content Title\n\nYour markdown content goes here.",
};

const testObj = mdma.new();

try {
  testObj.Parse(testData);
  console.log("test1", "pass");
} catch (error) {
  console.log("test1", "fail");
}

let test3 = testObj.version;
if (test3 === expectedData.version) {
  console.log("test3", "pass");
} else {
  console.log("test3", "fail");
}

HeaderTest("test4_1", "title");
HeaderTest("test4_2", "author");
HeaderTest("test4_3", "created");
HeaderTest("test4_4", "modified");
HeaderTest("test4_5", "version");
HeaderTest("test4_6", "custom-metadata");
HeaderTest("test4_7", "multi-Line");
HeaderTest("test4_8", "colon");
HeaderTest("test4_9", "multi-header-support");
HeaderTest("test4_10", "header-with-quotes");

let test5 = testObj.GetTitle();
if (test5 === expectedData.headers["title"][0]) {
  console.log("test5", "pass");
} else {
  console.log("test5", "fail");
}

let test6 = testObj.GetAuthor();
if (test6 === expectedData.headers["author"][0]) {
  console.log("test6", "pass");
} else {
  console.log("test6", "fail");
}

let test7 = testObj.GetCreated();
if (test7 === expectedData.headers["created"][0]) {
  console.log("test7", "pass");
} else {
  console.log("test7", "fail");
}

let test8 = testObj.GetModified();
if (test8 === expectedData.headers["modified"][0]) {
  console.log("test8", "pass");
} else {
  console.log("test8", "fail");
}

let test9 = testObj.GetContent();
if (test9 === expectedData.content) {
  console.log("test9", "pass");
} else {
  console.log("test9", "fail");
}

function HeaderTest(name, headerName) {
  const testValues = testObj.GetHeader(headerName);
  const expectedValues = expectedData.headers[headerName.toLowerCase()];
  let fail = false;
  if (
    Array.isArray(testValues) &&
    testValues.length === expectedValues.length
  ) {
    for (let i = 0; i < expectedValues.length; i++) {
      const expected = expectedValues[i];
      const testValue = testValues[i];
      if (testValue === expected) {
      } else {
        fail = true;
      }
    }
    console.log(name, fail ? "fail" : "pass");
  }
}
