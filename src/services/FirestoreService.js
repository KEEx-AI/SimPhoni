// src/services/FileService.js

export async function saveTextFile(content, defaultName="InferenceSequence.txt") {
  if (window.showSaveFilePicker) {
    // Use File System Access API if available
    try {
      const opts = {
        suggestedName: defaultName,
        types: [{
          description: 'Text Files',
          accept: {'text/plain': ['.txt']}
        }]
      };
      const handle = await window.showSaveFilePicker(opts);
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      return;
    } catch (err) {
      console.warn('showSaveFilePicker failed, fallback to download link', err);
    }
  }

  // Fallback: create a blob link and auto-click
  const blob = new Blob([content], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = defaultName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
