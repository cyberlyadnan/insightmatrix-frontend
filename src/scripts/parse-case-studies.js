/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "../constants/case-studies.ts");
const outputPath = path.join(__dirname, "../constants/parsed-content.json");

const rawText = fs.readFileSync(inputPath, "utf8");
const lines = rawText.split("\n");

const data = {
  sections: [],
};

let currentSection = null;
let currentSubSection = null;

const sectionRegex = /^—\s*(.*)$/; // e.g., — HOME PAGE
const h1Regex = /^#\s+(.*)$/; // e.g., # OVERVIEW
const h2Regex = /^##\s+(.*)$/; // e.g., ## Our Services
const h3Regex = /^###\s+(.*)$/; // e.g., ### Quantitative Research
const listRegex = /^\*\s+(.*)$/; // e.g., * Healthcare

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  if (sectionRegex.test(line)) {
    const match = line.match(sectionRegex);
    currentSection = {
      title: match[1],
      blocks: [],
    };
    data.sections.push(currentSection);
    currentSubSection = null;
  } else if (h1Regex.test(line)) {
    const match = line.match(h1Regex);
    currentSubSection = {
      type: "h1",
      title: match[1],
      content: [],
      items: [],
    };
    if (!currentSection) {
      currentSection = { title: "General", blocks: [] };
      data.sections.push(currentSection);
    }
    currentSection.blocks.push(currentSubSection);
  } else if (h2Regex.test(line)) {
    const match = line.match(h2Regex);
    currentSubSection = {
      type: "h2",
      title: match[1],
      content: [],
      items: [],
    };
    if (!currentSection) {
      currentSection = { title: "General", blocks: [] };
      data.sections.push(currentSection);
    }
    currentSection.blocks.push(currentSubSection);
  } else if (h3Regex.test(line)) {
    const match = line.match(h3Regex);
    currentSubSection = {
      type: "h3",
      title: match[1],
      content: [],
      items: [],
    };
    if (!currentSection) {
      currentSection = { title: "General", blocks: [] };
      data.sections.push(currentSection);
    }
    currentSection.blocks.push(currentSubSection);
  } else if (listRegex.test(line)) {
    const match = line.match(listRegex);
    if (currentSubSection) {
      currentSubSection.items.push(match[1]);
    } else {
      if (!currentSection) {
        currentSection = { title: "General", blocks: [] };
        data.sections.push(currentSection);
      }
      currentSection.blocks.push({
        type: "list",
        items: [match[1]],
      });
    }
  } else {
    // Normal paragraph
    if (line !== "---" && !line.startsWith("//") && !line.startsWith("/*")) {
      if (currentSubSection) {
        currentSubSection.content.push(line);
      } else {
        if (!currentSection) {
          currentSection = { title: "General", blocks: [] };
          data.sections.push(currentSection);
        }
        currentSection.blocks.push({
          type: "paragraph",
          content: [line],
        });
      }
    }
  }
}

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf8");
console.log("Successfully parsed into JSON. Total sections:", data.sections.length);
