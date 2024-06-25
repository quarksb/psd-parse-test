import { readPsd } from 'ag-psd';
import Psd from "@webtoon/psd";
import PSDJS from "psd.js";
import sb from "../public/shape-text.psd?raw";

// console.log(sb);


const inputEl: HTMLInputElement = document.querySelector("input[type='file']");

type parsePsd = (file: File) => Promise<HTMLCanvasElement>;

const loadPsdByAgPsd: parsePsd = async (file: File) => {
  const result = await file.arrayBuffer();
  const psdAg = readPsd(result);
  console.log("ag-psd", psdAg.children);
  return psdAg.children[0].canvas;
}

const loadPsdByWebtoonPsd: parsePsd = async (file: File) => {
  const result = await file.arrayBuffer();
  const psdFile = Psd.parse(result);
  console.log("webtoon/psd", psdFile.children);
  const canvasElement = document.createElement("canvas");
  const context = canvasElement.getContext("2d");
  const compositeBuffer = await psdFile.composite();
  const imageData = new ImageData(
    compositeBuffer,
    psdFile.width,
    psdFile.height
  );
  canvasElement.width = psdFile.width;
  canvasElement.height = psdFile.height;
  context.putImageData(imageData, 0, 0);
  return canvasElement;
}

const loadPsdByPsdJs: parsePsd = async (file: File) => {
  const psdJs = await PSDJS.fromDroppedFile(file);
  const data = psdJs.tree().export();
  console.log("psd.js", data);
  return psdJs.image.toPng();
}

export const loadPsd = async (file: File) => {
  const promises = [
    // ag-psd
    loadPsdByAgPsd(file),
    // webtoon / psd
    loadPsdByWebtoonPsd(file),
    // psd.js
    loadPsdByPsdJs(file),
  ];
  const canvas = await Promise.all(promises);
  return canvas;
}

inputEl.addEventListener("change", async () => {
  const file = inputEl.files[0];
  loadPsd(file);
})

// 通过 http 请求加载 psd 文件
// fetch("/shape-text.psd")
//   .then((response) => response.arrayBuffer())
//   .then((data) => {
//     loadPsd(new File([data], "shape-text.psd"));
//   });


