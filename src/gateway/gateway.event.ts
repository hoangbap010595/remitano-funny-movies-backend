import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RFMEventType, RFMDataEvent } from 'src/gateway/dto/event-type.enum';
import { AuthService } from 'src/auth/auth.service';
import { ShareMovieProducerService } from 'src/queues/share-movie.producer.service';

@WebSocketGateway(3003, {
  cors: { origin: [process.env.ALLOW_CORS] },
})
export class RFMGatewayEvents
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private authService: AuthService,
    private shareMovieProducer: ShareMovieProducerService
  ) {}

  @WebSocketServer()
  server: Server;
  clients: any = {};
  connectedClients: Socket[] = [];

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client ${client.id} connected`);
    this.clients[client.id] = null;
    this.connectedClients.push(client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client ${client.id} disconnected`);
    delete this.clients[client.id];
    this.connectedClients = this.connectedClients.filter(
      (c) => c.id !== client.id
    );
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.shareMovieProducer.shareMovie(body);
    this.server.emit('onMessage', {
      action: RFMEventType.NEW_MESSAGE,
      payload: body,
    });
  }

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: RFMDataEvent,
    @ConnectedSocket() client: Socket
  ): string {
    if (!this.clients[client.id] && data.action !== RFMEventType.INIT) {
      return 'AHIHI';
    }
    const clientUser = this.clients[client.id];
    const msgDataJob = {
      payload: data.payload,
      user: clientUser,
    };
    // Actions
    switch (data.action) {
      case RFMEventType.CREATE_POST:
        this.shareMovieProducer.createPost(msgDataJob);
        break;
      case RFMEventType.SHARE_VIDEO:
        this.shareMovieProducer.shareMovie(msgDataJob);
        break;
      case RFMEventType.LIKE_POST:
      case RFMEventType.DISLIKE_POST:
        this.shareMovieProducer.reactPost(msgDataJob);
        break;
      case RFMEventType.INIT:
        this.authService.getUserFromToken(data.payload.token).then((user) => {
          this.clients[client.id] = user;
          client.emit('onMessage', {
            action: RFMEventType.INIT,
            payload: {
              message: 'Connected to server!!!',
            },
          });
        });
        break;
      default:
        console.log('Action not found');
        client.emit('onMessage', 'Action not found');
        break;
    }
    return data.action;
  }

  sendMessageToClient(clientId: string, message: any) {
    const client = this.connectedClients.find((c) => c.id === clientId);
    if (client) {
      client.emit('onMessage', message);
    }
  }

  sendMessageToAllClients(message: any) {
    this.server.emit('onMessage', message);
  }
}
