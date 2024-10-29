# Java Security Analysis Project

This project provides an automated way to decompile Java JAR files, analyze the code for potential malicious patterns, and report findings. Using OpenAI's API, this tool reviews Java source code for suspicious elements that may warrant further manual inspection.

## Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Project
This project aims to streamline the analysis of Java JAR files by decompiling the code and then utilizing OpenAI's language models to detect suspicious patterns, potentially malicious code, and vulnerable areas that may need manual review. The results are returned in JSON format, specifying files and code snippets that may contain security risks.

## Features
- Automated decompilation of Java JAR files
- Recursive analysis of decompiled Java files
- Integration with OpenAI's API for detecting suspicious code patterns
- JSON output of analysis results, highlighting:
    - Files with potentially malicious code
    - Specific suspicious code blocks
    - Recommendation for manual review if needed

## Prerequisites
- **Java** (version 11 or higher)
- **Node.js** (version 20 or higher)
- OpenAI API key

## Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/Naimadx123/jar-analysis.git
   cd jar-analysis
   ```
2. Install necessary Node.js packages:
   ```bash
   npm install
   ```
3. Place the `cfr.jar` (Java Decompiler) in the project root directory.

4. Create a `.env` file to store your OpenAI API key:
   ```bash
   echo "API_KEY=your_openai_api_key" > .env
   ```

## Usage
1. Run the analysis by specifying the path to the JAR file as an argument:
   ```bash
   node index.js /path_to_your_file/File.jar
   ```
2. The analysis results will be displayed in the console as JSON output.

### Sample Output
```json
[
  {
    "filename": "decompiled_code/com/example/MyClass.java",
    "positive": true,
    "should_be_checked": true,
    "suspicious_code_blocks": [
      "System.loadLibrary('native_lib')",
      "Runtime.getRuntime().exec('curl malicious-site.com')"
    ]
  }
]
```

## Configuration
The `.env` file should include your OpenAI API key:
```plaintext
API_KEY=your_openai_api_key
```

## How It Works
1. **Decompile JAR**: The specified JAR file is decompiled into Java source files.
2. **Recursive Analysis**: Each `.java` file is read and analyzed for malicious patterns.
3. **OpenAI Analysis**: The code content is sent to OpenAI's model, which identifies potential risks and returns structured results.
4. **Results JSON**: Files with suspicious content are flagged and details provided in JSON format.

## Contributing
Contributions are welcome! Please fork this repository and submit pull requests for review.

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Project maintained by Naimad (discord: 4g0).
