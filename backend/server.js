const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compiler = require('compilex');
const fs = require('fs');
const path = require('path');

const fileRoutes = require('./routes/fileRoutes');
const gptRoutes = require('./routes/gpt');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Debug: log API key (⚠️ remove this in production)
console.log('🔐 OpenAI Key:', process.env.OPENAI_API_KEY);

// Initialize compilex
compiler.init({ stats: true });

// MongoDB (optional - commented out)
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mydb')
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch((err) => {
//     console.error('❌ MongoDB connection error:', err.message);
//     process.exit(1);
//   });

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/gpt', gptRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('🔥 Backend is working with C++, Python, and Java!');
});

// Helper: Fix Java filename based on public class
const fixJavaFilename = (code, tempPath) => {
  const match = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
  if (match) {
    const className = match[1];
    const newFileName = `${className}.java`;
    const newFilePath = path.join(tempPath, newFileName);
    fs.writeFileSync(newFilePath, code);
    return newFilePath;
  }
  return null;
};

// Compile endpoint
app.post('/compile', (req, res) => {
  const { code, input = '', language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Missing code or language!' });
  }

  const envData = {
    OS: 'windows',
    cmd: 'g++',
    options: { timeout: 10000 },
  };

  const hasInput = input.trim() !== '';

  try {
    switch (language.toLowerCase()) {
      case 'cpp':
        if (hasInput) {
          compiler.compileCPPWithInput(envData, code, input, (data) => {
            console.log('✅ C++ (with input):', data);
            if (data.error) return res.json({ error: data.error });
            return res.json({ output: data.output });
          });
        } else {
          compiler.compileCPP(envData, code, (data) => {
            console.log('✅ C++ (no input):', data);
            if (data.error) return res.json({ error: data.error });
            return res.json({ output: data.output });
          });
        }
        break;

      case 'python':
        compiler.compilePythonWithInput(envData, code, input, (data) => {
          console.log('🐍 Python:', data);
          if (data.error) return res.json({ error: data.error });
          return res.json({ output: data.output });
        });
        break;

      case 'java': {
        const tempPath = './temp/' + Math.random().toString(36).slice(2, 10);
        fs.mkdirSync(tempPath, { recursive: true });

        const fixedFilePath = fixJavaFilename(code, tempPath);
        if (!fixedFilePath) {
          return res.status(400).json({ error: '❌ Could not detect public class in Java code!' });
        }

        const modifiedCode = fs.readFileSync(fixedFilePath, 'utf-8');

        compiler.compileJavaWithInput({ OS: 'windows' }, modifiedCode, input, (data) => {
          console.log('☕ Java:', data);
          if (data.error) return res.json({ error: data.error });
          res.json({ output: data.output });

          // Optional cleanup
          fs.rmSync(tempPath, { recursive: true, force: true });
        });
        break;
      }

      default:
        return res.status(400).json({ error: '❌ Unsupported language!' });
    }
  } catch (err) {
    console.error('❌ Compilation error:', err);
    res.status(500).json({ error: 'Compiler crashed', details: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
