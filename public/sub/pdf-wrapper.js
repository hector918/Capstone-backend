// <!-- <script src="https://unpkg.com/pdfjs-dist@2/build/pdf.js"></script>
// <script src="https://unpkg.com/pdfjs-dist@2/build/pdf.worker.js"></script> -->
const cdn_pdfjs_link = '//mozilla.github.io/pdf.js/build/pdf.js';
const cdn_pdfjs_worker_link = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
let PDFJS;
const script = document.createElement('script');
script.src = cdn_pdfjs_link;
script.async = true;
script.onload = () => {
  PDFJS = window['pdfjs-dist/build/pdf'];
  PDFJS.GlobalWorkerOptions.workerSrc = cdn_pdfjs_worker_link;
};
document.body.appendChild(script);
////hector build jun/01/2023 //////////////////////////
async function extractTextAndImageFromPDF(url){
  if(PDFJS === undefined) throw new Error("pdfjs not found");
  if(url.trim() === "") return false;
  
  const pdf = await PDFJS.getDocument(url).promise;
  const ret = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    ret.push(await parsePage(page));
  }
  return ret;
  ////////////////////////////////////////////
  async function parsePage(page){
    const imgs = [];
    const {fnArray, argsArray} = await page.getOperatorList();
    argsArray.forEach(async (arg, i) => {
      if(fnArray[i] === PDFJS.OPS.paintImageXObject) {
        imgs.push(await page.objs.get(arg[0]));
      }
    });
    const text = await page.getTextContent();
    return {imgs, text};
  }
}

export {extractTextAndImageFromPDF};