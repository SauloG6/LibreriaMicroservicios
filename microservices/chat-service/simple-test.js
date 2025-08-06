const express = require('express');
const app = express();
const port = 3003;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/test', (req, res) => {
  res.json({ message: '¡Chat Service funcionando!', timestamp: new Date() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'chat-service' });
});

app.listen(port, () => {
  console.log(`🚀 Chat Service TEST ejecutándose en puerto ${port}`);
  console.log(`📡 Prueba: http://localhost:${port}/test`);
});

module.exports = app;
