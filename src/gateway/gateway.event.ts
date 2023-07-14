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
import { RFMGatewayService } from 'src/gateway/gateway.service';
import {
  RFMEventType,
  RFMDataEvent,
  RFMClients,
} from 'src/gateway/dto/event-type.enum';
import { AuthService } from 'src/auth/auth.service';
import * as ytdl from 'ytdl-core';

@WebSocketGateway(3003, { transports: ['websocket'] })
export class RFMGatewayEvents
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private rfmGatewayService: RFMGatewayService,
    private authService: AuthService
  ) {}

  @WebSocketServer()
  server: Server;
  clients: any = {};

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`${client.id} connected`);
    this.clients[client.id] = null;
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`${client.id} disconnected`);
    delete this.clients[client.id];
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
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

    switch (data.action) {
      case RFMEventType.CREATE_POST:
        // ytdl
        //   .getInfo(data.payload.link)
        //   .then((info: ytdl.videoInfo) => {
        //     if (info) {
        //       console.log('Tiêu đề:', info.videoDetails.title);
        //       console.log('Tác giả:', info.videoDetails.author.name);
        //       console.log(
        //         'Thời lượng (giây):',
        //         info.videoDetails.lengthSeconds
        //       );
        //       console.log('URL hình ảnh:', info.thumbnail_url);
        //       console.log('URL video:', info.videoDetails.video_url);
        //     }
        //   })
        //   .catch((error: any) => {
        //     console.log(error);
        //   });
        this.rfmGatewayService
          .createPost(this.clients[client.id].id, {
            title: data.payload.title,
            content: data.payload.content,
            link: data.payload.link,
          })
          .then((post) => {
            console.log(post);
            this.server.emit('onMessage', {
              action: RFMEventType.NOTIFY_SHARE_VIDEOS,
              payload: {
                title: post.title,
                content: post.content,
                author: this.clients[client.id].username,
                link: post.link,
              },
            });
          });
        break;
      case RFMEventType.INIT:
        this.authService.getUserFromToken(data.payload.token).then((user) => {
          this.clients[client.id] = user;
          //   console.log(user);
        });
        break;
      default:
        console.log('Action not found');
        break;
    }
    return data.action;
  }
}
