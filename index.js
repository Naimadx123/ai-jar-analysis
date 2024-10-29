const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const OpenAI = require("openai");
require('dotenv').config()

const client = new OpenAI({
  apiKey: process.env.API_KEY
});

function decompileJar(jarPath, outputDir) {
  return new Promise((resolve, reject) => {
    exec(`java -jar cfr.jar ${jarPath} --outputdir ${outputDir}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Decompilation error: ${error.message}`);
      } else {
        resolve(outputDir);
      }
    });
  });
}

function readDecompiledCode(dir) {
  let codeBlocks = [];

  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      codeBlocks = codeBlocks.concat(readDecompiledCode(filePath));
    } else if (filePath.endsWith('.java')) {
      const code = fs.readFileSync(filePath, 'utf-8');
      codeBlocks.push({ filename: filePath, code });
    }
  });

  return codeBlocks;
}

async function analyzeCodeWithOpenAI(codeBlock) {
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a code security expert. Identify suspicious patterns in Java code.',
        },
        {
          role: 'user',
          content: `Analyze the following Java code for potential malicious patterns:\n\n${codeBlock.code}`,
        },
      ],
      functions: [
        {
          name: 'identify_suspicious_code',
          description: 'Identify if Java code has malicious patterns.',
          parameters: {
            type: 'object',
            properties: {
              positive: { type: 'boolean', description: 'True if suspicious code is found' },
              should_be_checked: {
                type: 'boolean',
                description: 'True if the code requires manual analysis by staff',
              },
              suspicious_code_blocks: {
                type: 'array',
                description: 'An array of suspicious code snippets detected',
                items: { type: 'string' },
              },
            },
            required: ['positive', 'should_be_checked'],
          },
        },
      ],
      function_call: { name: 'identify_suspicious_code' },
    });

    const functionResponse = response.choices[0].message.function_call.arguments;
    return JSON.parse(functionResponse);
  } catch (error) {
    console.error('Error analyzing code with OpenAI:', error);
    return null;
  }
}

async function analyzeJar(jarPath) {
  const outputDir = './decompiled_code';

  try {
    console.log('Decompiling...')
    await decompileJar(jarPath, outputDir);
    console.log('Decompilation complete.');
  } catch (error) {
    console.error(error);
    return;
  }

  const codeBlocks = readDecompiledCode(outputDir);
  const results = [];

  for (const codeBlock of codeBlocks) {
    console.log(`Analyzing ${codeBlock.filename}...`);
    const analysisResult = await analyzeCodeWithOpenAI(codeBlock);
    if (analysisResult && analysisResult.positive) {
      results.push({
        filename: codeBlock.filename,
        positive: analysisResult.positive,
        should_be_checked: analysisResult.should_be_checked,
        suspicious_code_blocks: analysisResult.suspicious_code_blocks || [],
      });
    }
  }

  console.log('Analysis Results:', JSON.stringify(results, null, 2));
}

const jarPath = process.argv[2];

if (!jarPath) {
  console.error("Please provide the path to the JAR file as an argument, e.g., 'node index.js /path_to_my_file/plugin.jar'");
  process.exit(1);
}

analyzeJar(jarPath);
