// src/services/flattenInstructSchema.js

/**
 * Recursively flattens an IS schema's instruct lines by expanding loop segments.
 * Returns an array of instruct line objects that each have:
 * { persona, instructText, model?, type: 'instruct' }.
 */
export function flattenInstructLines(instructLines, depth = 0) {
  const flattened = [];

  if (!Array.isArray(instructLines)) {
    console.warn("flattenInstructLines called with non-array instructLines:", instructLines);
    return flattened;
  }

  for (const line of instructLines) {
    if (line.type === 'instruct') {
      flattened.push(line);
    } else if (line.type === 'loop' && Array.isArray(line.instructLines)) {
      const { iterations = 1, instructLines: subLines } = line;
      for (let i = 0; i < iterations; i++) {
        const subFlattened = flattenInstructLines(subLines, depth + 1);
        flattened.push(...subFlattened);
      }
    } else {
      console.warn("Encountered unknown line type or invalid data:", line);
    }
  }

  if (depth === 0) {
    console.log("flattenInstructLines result:", flattened);
  }

  return flattened;
}
