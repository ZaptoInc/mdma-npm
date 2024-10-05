const mdma = require("../index");

const testData = `<!--\r\nMDMA/1.0
title: "Document Title"
author: "Author Name"
created: 2024-10-03T14:30:45.000Z
modified: 2024-10-04T09:15:22.000Z
version: 1
custom-metadata: "Custom Value"
multi-Line: "Multi\r\nLine\r\nSupport"
colon: "Colon Support: True"
multi-header-support : True\r\nmulti-header-support : false
header-with-quotes : ""test""
old-iso-date: 2024-10-03T14:30:45\r\n-->
# Content Title\r\n
Your markdown content goes here.`;

const expectedData = {
  version: "1.0",
  headers: {
    title: ["Document Title"],
    author: ["Author Name"],
    created: [new Date("2024-10-03T14:30:45.000Z")],
    modified: [new Date("2024-10-04T09:15:22.000Z")],
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

let failed = [];

try {
  testObj.Parse(testData);
  BooleanTest("test1", true);
} catch (error) {
  BooleanTest("test1", false);
  console.log(error);
}

BooleanTest("test3", testObj.version === expectedData.version);

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

BooleanTest("test5", testObj.GetTitle() === expectedData.headers["title"][0]);
BooleanTest("test6", testObj.GetAuthor() === expectedData.headers["author"][0]);
BooleanTest(
  "test7",
  testObj.GetCreated().getTime() ===
    expectedData.headers["created"][0].getTime()
);
BooleanTest(
  "test8",
  testObj.GetModified().getTime() ===
    expectedData.headers["modified"][0].getTime()
);
BooleanTest("test9", testObj.GetContent() === expectedData.content);

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
      if (
        typeof testValue === typeof expected && testValue instanceof Date
          ? testValue.getTime() === expected.getTime()
          : testValue === expected
      ) {
      } else {
        fail = true;
      }
    }
    BooleanTest(name, !fail);
  }
}

function BooleanTest(name, test) {
  console.log(name, test ? "pass" : "fail");
  if (!test) failed.push(name);
}

console.log(testObj.ToString());

if (failed.length > 0) {
  console.log(`${failed.length} fails (${failed.join(", ")})`);
} else {
  console.log("No fails, everything pass");
}
