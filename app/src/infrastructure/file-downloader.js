/** @returns {import('../application/ports.js').FileDownloader} */
export function createFileDownloader() {
  return {
    download({ filename, content, mime }) {
      const url = URL.createObjectURL(new Blob([content], { type: mime }));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
  };
}
