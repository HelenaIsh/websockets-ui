import { WebSocketServer } from 'ws';
import controllers from './routes/routes';
import { Message, Res } from './types';

export function createWebSocketServer() {
  const wsServer = new WebSocketServer({ port: 3000 });

  wsServer.on('connection', (ws) => {
    console.log('Новое WebSocket соединение установлено.');

    ws.on('message', (message: string) => {
      const parsedMessage: Message = JSON.parse(message.toString());
      const type = parsedMessage.type;
      const data = parsedMessage.data
        ? JSON.parse(parsedMessage.data as string)
        : '';
        console.log('get new message: ',type, data)
      controllers(type as Res, data, ws);
    });

    ws.on('close', () => {
      console.log('WebSocket соединение закрыто.');
    });
  });
}
