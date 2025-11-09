import {
  WebSocketGateway, WebSocketServer,
  OnGatewayConnection, OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket'], // más estable en LAN floja
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);
  @WebSocketServer() server: Server;

  handleConnection(socket: Socket) {
    const id_cliente = socket.handshake.query.id_cliente as string | undefined;
    const id_expediente = socket.handshake.query.id_expediente as string | undefined;

    this.logger.log(
      `WS connect ${socket.id} q={cliente:${id_cliente ?? '-'}, exp:${id_expediente ?? '-'}}`,
    );

    if (id_cliente) socket.join(`cliente:${id_cliente}`);
    if (id_expediente) socket.join(`expediente:${id_expediente}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`WS disconnect ${socket.id}`);
  }

  // 🔎 Siempre loguea el tamaño de la sala y emite, aunque no haya clientes
  async emitNotaCreada(idCliente: number, payload: any) {
    const room = `cliente:${idCliente}`;
    const sockets = await this.server.in(room).fetchSockets();
    this.logger.log(
      `emit nota:creada -> ${room} (clients=${sockets.length}) nota=${payload?.id_nota} exp=${payload?.id_expediente}`,
    );
    this.server.to(room).emit('nota:creada', payload);
  }

  // (Opcional) por expediente si algún día quieres escuchar por expId
  async emitNotaCreadaEnExpediente(idExp: number, payload: any) {
    const room = `expediente:${idExp}`;
    const sockets = await this.server.in(room).fetchSockets();
    this.logger.log(
      `emit nota:creada -> ${room} (clients=${sockets.length}) nota=${payload?.id_nota}`,
    );
    this.server.to(room).emit('nota:creada', payload);
  }
}
