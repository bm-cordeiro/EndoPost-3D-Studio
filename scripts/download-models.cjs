const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");

const base = "https://cdn.jsdelivr.net/gh/sameralseedbth-Dental/dental-3d-models@main/";
const files = [
  "maxillary_left_central_incisor.glb",
  "maxillary_lateral_incisor.glb",
  "maxillary_canine.glb",
  "maxillary_first_premolar.glb",
  "maxillary_second_premolar.glb",
  "maxillary_first_molar.glb",
  "maxillary_second_molar.glb",
  "maxillary_third_molar.glb",
  "mandibular_left_central_incisor.glb",
  "mandibular_left_lateral_incisor.glb",
  "mandibular_left_canine.glb",
  "mandibular_first_premolar.glb",
  "mandibular_left_second_premolar.glb",
  "mandibular_first_molar.glb",
  "mandibular_second_molar.glb",
  "mandibular_third_molar.glb",
];
const outDir = path.join(process.cwd(), "public", "models");
fs.mkdirSync(outDir, { recursive: true });

function download(file) {
  return new Promise((resolve, reject) => {
    const target = path.join(outDir, file);
    if (fs.existsSync(target) && fs.statSync(target).size > 1000) {
      console.log(`Já existe: ${file}`);
      return resolve();
    }
    const request = https.get(base + file, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        https.get(response.headers.location, (redirected) => saveResponse(redirected, target, file, resolve, reject));
        return;
      }
      saveResponse(response, target, file, resolve, reject);
    });
    request.on("error", reject);
  });
}

function saveResponse(response, target, file, resolve, reject) {
  if (response.statusCode !== 200) {
    response.resume();
    return reject(new Error(`${file}: HTTP ${response.statusCode}`));
  }
  const stream = fs.createWriteStream(target);
  response.pipe(stream);
  stream.on("finish", () => {
    stream.close();
    console.log(`Baixado: ${file}`);
    resolve();
  });
  stream.on("error", reject);
}

(async () => {
  for (const file of files) {
    try {
      await download(file);
    } catch (error) {
      console.error(`Falha ao baixar ${file}:`, error.message);
      process.exitCode = 1;
    }
  }
  if (process.exitCode) {
    console.error("\\nSe você já tem os GLBs da versão anterior, copie os 16 arquivos para public/models.");
  }
})();
