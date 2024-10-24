import { WebSocketServer } from 'ws';
import controllers from './routes/routes';

export function createWebSocketServer() {
  const wsServer = new WebSocketServer({ port: 3000 });

  wsServer.on('connection', (ws) => {
    console.log('Новое WebSocket соединение установлено.');

    ws.on('message', (message: string) => {
      const type = JSON.parse(message).type;
      const data = JSON.parse(JSON.parse(message).data);
      const response = controllers(type, data)
      ws.send(response as any);
    });

    ws.on('close', () => {
      console.log('WebSocket соединение закрыто.');
    });
  });
}
