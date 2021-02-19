// "use strict";
// var __createBinding = (this && this.__createBinding) || (Object.create ? function(o, m, k, k2) {
//   if (k2 === undefined) k2 = k;
//   Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
// } : function(o, m, k, k2) {
//   if (k2 === undefined) k2 = k;
//   o[k2] = m[k];
// });
// var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? function(o, v) {
//   Object.defineProperty(o, "default", { enumerable: true, value: v });
// } : function(o, v) {
//   o["default"] = v;
// });
// var __importStar = (this && this.__importStar) || function (mod) {
//   if (mod && mod.__esModule) return mod;
//   var result = {};
//   if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
//   __setModuleDefault(result, mod);
//   return result;
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// const fs = __importStar(require("fs"));
// const JSZip = __importStar(require("jszip"));
// const crypto = __importStar(require("crypto"));
// const Diff = __importStar(require("diff"));
// const versionsPath = process.env.APPDATA + "/.minecraft/versions";
// let version1 = "21w03a";
// let version2 = "21w05b";
// // console.log(fs.readdirSync(versionsPath));
// async function check() {
//   let data1 = fs.readFileSync(versionsPath + "/" + version1 + "/" + version1 + ".jar");
//   let data2 = fs.readFileSync(versionsPath + "/" + version2 + "/" + version2 + ".jar");
//   let zip1 = await JSZip.loadAsync(data1);
//   let zip2 = await JSZip.loadAsync(data2);
//   let filesToCheck = [];
//   let changedFiles = [];
//   let addedFiles = [];
//   let removedFiles = [];
//   for (let f in zip1.files) {
//     if (!filesToCheck.includes(f) && doesFileNeedToBeChecked(f)) {
//       filesToCheck.push(f);
//     }
//   }
//   for (let f in zip2.files) {
//     if (!filesToCheck.includes(f) && doesFileNeedToBeChecked(f)) {
//       filesToCheck.push(f);
//     }
//   }
//   console.log(filesToCheck.length, "files to check, this might take a while.");
//   for (let filename of filesToCheck) {
//     if (zip1.file(filename) && zip2.file(filename)) {
//       if (filename.endsWith(".json") || filename.endsWith(".mcmeta") || filename.endsWith(".txt") || filename.endsWith(".fsh") || filename.endsWith(".vsh")) {
//         // @ts-ignore
//         let fileContent1 = await zip1.file(filename).async("string");
//         // @ts-ignore
//         let fileContent2 = await zip2.file(filename).async("string");
//         if (fileContent1 != fileContent2) {
//           changedFiles.push(filename);
//           console.log(filename);
//           let diffs = Diff.diffLines(fileContent1, fileContent2);
//           diffs.forEach(element => {
//             if (element.added) {
//               console.log("+", element.value);
//             } else if (element.removed) {
//               console.log("-", element.value);
//             }
//           });
//         }
//       } else if (filename.endsWith(".png")) {
//         // @ts-ignore
//         let hash1 = crypto.createHash("md5").update(await zip1.file(filename).async("binarystring")).digest("hex");
//         // @ts-ignore
//         let hash2 = crypto.createHash("md5").update(await zip2.file(filename).async("binarystring")).digest("hex");
//         if (hash1 != hash2) {
//           // console.log("png", filename);
//           changedFiles.push(filename);
//         }
//       } else if (filename.endsWith(".nbt")) {
//         // no idea how to properly compare nbt files, so i'm going to ignore them
//         // let hash1 = await zip1.file(filename).async("arraybuffer");
//         // let hash2 = await zip2.file(filename).async("arraybuffer");
//         // if(hash1.equals(hash2)){
//         //     console.log("other hash", hash1, hash2, filename);
//         // }
//       } else {
//         // ignoring everything else
//         // console.log("other", filename);
//       }
//     } else if (zip1.file(filename) && !zip2.file(filename)) {
//       removedFiles.push(filename);
//     } else {
//       addedFiles.push(filename);
//     }
//   }
//   console.log(changedFiles);
// }
// check();
// function doesFileNeedToBeChecked(f) {
//   if (!f.startsWith("data") && !f.startsWith("assets")) { return false; }
//   if (f.endsWith(".class")) { return false; }
//   return true;
// }
