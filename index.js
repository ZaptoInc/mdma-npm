function splitLinesPreserveQuotes(input) {
  const lines = [];
  let currentLine = "";
  let insideQuote = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === '"') {
      insideQuote = !insideQuote; // Toggle the state of being inside quotes
    }

    if (char === "\n" && !insideQuote) {
      lines.push(currentLine);
      currentLine = "";
    } else {
      currentLine += char;
    }
  }

  if (currentLine) {
    lines.push(currentLine); // Push the last line if there's any
  }

  return lines;
}

function splitLineOnce(line) {
  let insideQuote = false;
  let splitIndex = -1;

  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      insideQuote = !insideQuote; // Toggle the quote state
    }
    if (line[i] === ":" && !insideQuote) {
      splitIndex = i; // Mark the position of the first colon outside quotes
      break;
    }
  }

  // If a colon was found, split the line at that index
  if (splitIndex !== -1) {
    return [
      line.slice(0, splitIndex).trim(),
      line.slice(splitIndex + 1).trim(),
    ];
  }

  // If no colon was found, return the original line
  return [line.trim()];
}

const isISOString = (val) => {
  const d = new Date(val);
  return !Number.isNaN(d.valueOf()) && d.toISOString() === val;
};

function detectHeaderDataType(data) {
  data = data.trim(); // Remove leading/trailing whitespace

  // Check if it's a string (starts and ends with quotes)
  if (data.startsWith('"') && data.endsWith('"')) {
    return "string";
  }

  // Check if it's an integer
  if (/^-?\d+$/.test(data)) {
    return "integer";
  }

  // Check if it's a boolean
  if (data.toLowerCase() === "true" || data.toLowerCase() === "false") {
    return "boolean";
  }

  // Check if it's an ISO 8601 date
  if (isISOString(data)) {
    return "date";
  }

  // If it doesn't match any of the above
  return "unknown";
}

function getMDMAVersion(data) {
  // Regular expression to match MDMA followed by a version number in the format MDMA/x.y
  const regex = /^MDMA\/(\d+\.\d+)$/;
  const match = data.trim().match(regex);

  // If the data matches, return the captured version number, otherwise return null
  return match ? match[1] : null;
}

function mdmaParse(mdma, content) {
  const lines = splitLinesPreserveQuotes(content.replaceAll("\r\n", "\n"));
  let inHeaders = false;
  let firstHeader = true;
  let inContent = true;
  let metadataRead = false;
  lines.forEach((line) => {
    if (!inHeaders && line === "<!--" && !metadataRead) {
      inHeaders = true;
      inContent = false;
      metadataRead = true;
    } else if (inHeaders && line === "-->") {
      inHeaders = false;
      inContent = true;
    } else if (inHeaders && firstHeader) {
      firstHeader = false;
      mdma.version = getMDMAVersion(line);
    } else if (inHeaders) {
      const splittedLine = splitLineOnce(line);
      const headerName = splittedLine[0].toLowerCase();
      const headerData = splittedLine[1];
      const lineType = detectHeaderDataType(headerData);
      if (!mdma.headers[headerName]) {
        mdma.headers[headerName] = [];
      }
      parsedData = null;
      switch (lineType) {
        case "string":
          parsedData = headerData.substring(1, headerData.length - 1);
          break;
        case "integer":
          parsedData = parseInt(headerData);
          break;
        case "boolean":
          parsedData = headerData.toLowerCase() === "true";
          break;
        case "date":
          parsedData = new Date(headerData);
          break;
        default:
          break;
      }
      mdma.headers[headerName].push(parsedData);
    } else if (inContent) {
      mdma.content.push(line);
    }
  });
  return mdma;
}

function mdmaToString(mdma) {
  let string = "<!--";
  if (mdma.version) string += `\nMDMA/${mdma.version}`;

  Object.entries(mdma.headers).forEach((header) => {
    header[1].forEach((headerValue) => {
      if (typeof headerValue == "string") headerValue = `"${headerValue}"`;
      if (headerValue instanceof Date) headerValue = headerValue.toISOString();
      string += `\n${header[0]}: ${headerValue}`;
    });
  });
  string += "\n-->\n";
  string += mdma.content.join("\n");
  return string;
}

function mdmaGetHeader(mdma, headerName) {
  if (mdma.headers[headerName.toLowerCase()]) {
    return mdma.headers[headerName.toLowerCase()];
  } else {
    return undefined;
  }
}

function mdmaGetFirstHeader(mdma, headerName) {
  const header = mdmaGetHeader(mdma, headerName);
  if (header && header.length > 0) {
    return header[0];
  } else {
    return undefined;
  }
}

function mdmaSetHeaders(mdma, headerName, values) {
  if (Array.isArray(values)) {
    mdma.headers[headerName.toLowerCase()] = values;
  } else {
    mdma.headers[headerName.toLowerCase()] = [values];
  }
  return mdma;
}

function mdmaAddHeader(mdma, headerName, value) {
  if (mdma.headers[headerName.toLowerCase()]) {
    mdma.headers[headerName.toLowerCase()].push(value);
  } else {
    mdma.headers[headerName.toLowerCase()] = [value];
  }
  return mdma;
}

module.exports = {
  new: function () {
    let mdma = {
      //  headers
      // for example : { title : "My first MDMA post"}
      version: "1.0",
      headers: {},
      content: [],
      Parse: function (content) {
        return mdmaParse(this, content);
      },
      ToString: function () {
        return mdmaToString(this);
      },
      GetVersion: function () {
        return this.version;
      },
      GetHeader: function (headerName) {
        return mdmaGetHeader(this, headerName);
      },
      SetHeader: function (headerName, values) {
        mdmaSetHeaders(this, headerName, values);
        return this;
      },
      AddHeader: function (headerName, value) {
        mdmaAddHeader(this, headerName, value);
        return this;
      },
      GetTitle: function () {
        return mdmaGetFirstHeader(this, "title");
      },
      SetTitle: function (value) {
        mdmaSetHeaders(this, "title", value);
        return this;
      },
      GetAuthor: function () {
        return mdmaGetFirstHeader(this, "author");
      },
      SetAuthor: function (value) {
        mdmaSetHeaders(this, "author", value);
        return this;
      },
      GetCreated: function () {
        return mdmaGetFirstHeader(this, "created");
      },
      SetCreated: function (value) {
        if (value instanceof Date) {
          mdmaSetHeaders(this, "created", value);
        } else {
          throw new TypeError("value is not a Date");
        }
        return this;
      },
      GetModified: function () {
        return mdmaGetFirstHeader(this, "modified");
      },
      SetModified: function (value) {
        if (value instanceof Date) {
          mdmaSetHeaders(this, "modified", value);
        } else {
          throw new TypeError("value is not a Date");
        }
        return this;
      },
      GetContent: function () {
        return this.content.join("\n");
      },
      SetContent: function (content) {
        this.content = content.split("\r\n").join("\n").split("\n");
        return this;
      },
    };
    return mdma;
  },
};
