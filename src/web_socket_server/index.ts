import { WebSocketServer } from 'ws';


export function createWebSocketServer() {
  const wsServer = new WebSocketServer({ port: 3000 });

  wsServer.on('connection', (ws) => {
    console.log('Новое WebSocket соединение установлено.');

    ws.on('message', (message) => {
      console.log(`Получено сообщение: ${message}`);
      ws.send(`Привет! Ты отправил сообщение: ${message}`);
    });

    ws.on('close', () => {
      console.log('WebSocket соединение закрыто.');
    });
  });
}
