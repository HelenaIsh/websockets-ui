import { httpServer } from "./src/http_server/index";
import { createWebSocketServer } from './src/web_socket_server/index';

createWebSocketServer();

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
