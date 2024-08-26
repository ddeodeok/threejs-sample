// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// public 폴더를 정적 파일로 제공
app.use(express.static(path.join(__dirname, 'public')));

// index.html 파일을 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
