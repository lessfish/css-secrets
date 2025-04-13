const fs = require("fs");
const path = require("path");

function readRootDir() {
  return new Promise((resolve) => {
    fs.readdir("./", (err, files) => {
      resolve(files);
    });
  });
}

function getPromiseArr(files) {
  const promiseArr = [];

  // 遍历章
  files.forEach((file) => {
    // 排除 node_modules 和 .git 两个文件夹的干扰
    if (file === "node_modules" || file === ".git") return;

    let path1 = path.join(__dirname, file);
    let stats = fs.statSync(path1);

    // 排除类似 generate.js package.json 等文件的干扰
    if (!stats.isDirectory()) return;

    promiseArr.push(
      new Promise((resolve) => {
        const chapter = {
          chapterName: file, // 章节名
          sections: [], // 子章节名
        };

        fs.readdir(path1, (err, files) => {
          // 遍历节
          files.forEach((file) => {
            if (!file.endsWith(".html")) return;
            chapter.sections.push(file);
          });

          resolve(chapter);
        });
      })
    );
  });

  return promiseArr;
}

function generateMarkdown(res) {
  res.sort((a, b) => a.chapterName > b.chapterName);

  let markdownStr = "";
  let urlPrefix = `//lessfish.github.io/css-secrets/`;

  markdownStr += `# CSS SECRETS\n\n`;

  res.forEach((chapter) => {
    let { chapterName, sections } = chapter;

    markdownStr += `## ${chapterName}\n\n`;
    sections.sort();

    sections.forEach((sectionName) => {
      let url = urlPrefix + chapterName + "/" + sectionName;
      url = encodeURI(url);
      markdownStr += `- [${sectionName.replace(".html", "")}](${url})\n`;
    });

    markdownStr += "\n";
  });

  fs.writeFile("README.md", markdownStr, () => {
    console.log("README.md saved!");
  });
}

(async function () {
  const files = await readRootDir();
  const promiseArr = getPromiseArr(files);

  Promise.all(promiseArr)
    .then((res) => {
      generateMarkdown(res);
    })
    .catch((err) => {
      console.log(err);
    });
})();
