const fs = require('fs');
const path = require('path');

const getAllMarkdownFiles = (directory) => {
  const files = fs.readdirSync(directory);

  return files.reduce((acc, file) => {
    const filePath = path.join(directory, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      const nestedFiles = getAllMarkdownFiles(filePath);
      return acc.concat(nestedFiles);
    } else if (path.extname(file) === '.md') {
      return acc.concat(filePath);
    }

    return acc;
  }, []);
};

const templateCache = {};
const templateRegex = /> template\(([\w/]+)\)/;

const getTemplateContent = (templateName, sourceFileName, sourceRow) => {
  const cachedTemplate = templateCache[templateName]
  if (cachedTemplate) {
    return cachedTemplate;
  }

  const templateFilePath = path.join(__dirname, '../../templates', `${templateName}.md`);

  let templateContent;
  try {
    templateContent = fs.readFileSync(templateFilePath, 'utf8');
  } catch (error) {
    console.error(error);
    throw new Error(`Template not found: ${templateName} (source: ${sourceFileName}:${sourceRow})`);
  }

  const arrayedTemplate = templateContent.trim()
    .split('\n');

  templateCache[templateName] = arrayedTemplate;
  return arrayedTemplate;
}

const main = () => {
  const tempFolderPath = path.join(__dirname, '../temp');
  if (fs.existsSync(tempFolderPath)) {
    fs.rmdirSync(tempFolderPath, { recursive: true });
  }

  const pagesDirectory = path.join(__dirname, '../content/pages');
  const markdownFiles = getAllMarkdownFiles(pagesDirectory);

  const fileContents = markdownFiles.map((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    const relativeFilePath = path.relative(pagesDirectory, filePath);

    console.log(`Loaded file: ${relativeFilePath}`);

    return { filePath, relativeFilePath, content: lines };
  });

  console.log('-----\n');

  const templateFiles = fileContents
    .reduce((templateFiles, file) => {
      const { filePath, relativeFilePath, content } = file;

      const matches = content.filter(l => templateRegex.test(l));
      if (matches.length === 0) {
        console.log(`Template application skipped: ${relativeFilePath}`);
        return templateFiles;
      }

      const replacedContent = content
        .map((line, i) => {
          const templateName = line.match(templateRegex)?.[1];
          if (!templateName) {
            return [line];
          }

          const templateContent = getTemplateContent(templateName, relativeFilePath, i + 1);
          return templateContent;
        })
        .reduce((p, c) => ([...p, ...c]), [])

      console.log(`Template applied: ${relativeFilePath}`);

      return [...templateFiles, { filePath, relativeFilePath, content: replacedContent }];
    }, []);

  console.log('-----\n');

  templateFiles.forEach((file) => {
    const { relativeFilePath, content } = file;
    const outputPath = path.join(__dirname, '../../temp', relativeFilePath);
    const outputDirectory = path.dirname(outputPath);

    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory, { recursive: true });
    }

    fs.writeFileSync(outputPath, `${content.join('\n').trim()}\n`);

    console.log(`File saved: ${relativeFilePath}`);
  });

  console.log('-----\nDone!');
}

main()
