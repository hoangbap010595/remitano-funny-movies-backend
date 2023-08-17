import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { RFMEventType } from 'src/gateway/dto/event-type.enum';
import { RFMGatewayEvents } from 'src/gateway/gateway.event';
import { RFMGatewayService } from 'src/gateway/gateway.service';
import * as ytdl from 'ytdl-core';

@Processor('share-movie')
export class ShareMovieConsumer {
  constructor(
    private readonly rfmGatewayService: RFMGatewayService,
    private readonly rFMGatewayEvents: RFMGatewayEvents
  ) {}

  @Process('share-movie-job')
  async shareMovieJob(job: Job<unknown>) {
    console.log('shareMovieJob - Begin');
    const bodyData: any = job.data;
    ytdl
      .getInfo(bodyData.payload.link)
      .then((info: ytdl.videoInfo) => {
        // console.log(info.videoDetails);
        if (info) {
          //   console.log('title:', info.videoDetails.title);
          //   console.log('description:', info.videoDetails.description);
          //   console.log('author:', info.videoDetails.author.name);
          //   console.log('URL video:', info.videoDetails.video_url);
          const content = info.videoDetails.description.substring(500);
          this.rfmGatewayService
            .createPost(bodyData.user.id, {
              title: info.videoDetails.title,
              content: content,
              link: info.videoDetails.embed.iframeUrl,
            })
            .then((post) => {
              //   console.log(post);
              this.rFMGatewayEvents.sendMessageToAllClients({
                action: RFMEventType.NOTIFY_SHARE_VIDEO,
                payload: {
                  error: 0,
                  message: `Your movie ${info.videoDetails.title}" has been shared!!!`,
                  data: {
                    title: info.videoDetails.title,
                    content: content,
                    author: bodyData.user.email,
                    link: info.videoDetails.video_url,
                    postId: post.id,
                  },
                },
              });
            });
        }
      })
      .catch((error: any) => {
        console.log(error);
        this.rFMGatewayEvents.sendMessageToClient(bodyData.clientId, {
          action: RFMEventType.NOTIFY_SHARE_VIDEO,
          payload: {
            error: 1,
            message: 'Your URL not a YouTube video',
            data: { author: bodyData.user.email },
          },
        });
      });
    console.log('shareMovieJob - End');
    return {};
  }

  @Process('create-post-job')
  async createPostJob(job: Job<unknown>) {
    console.log('createPostJob - Begin');
    const bodyData: any = job.data;
    this.rfmGatewayService
      .createPost(bodyData.user.id, {
        title: bodyData.payload.title,
        content: bodyData.payload.content,
        link: bodyData.payload.link,
      })
      .then((post) => {
        console.log(post);
        this.rFMGatewayEvents.sendMessageToAllClients({
          action: RFMEventType.NOTIFY_SHARE_VIDEO,
          payload: {
            title: post.title,
            content: post.content,
            author: bodyData.user.email,
            link: post.link,
            postId: post.id,
          },
        });
      });
    console.log('createPostJob - End');
    return {};
  }

  @Process('react-post-job')
  async reactPostJob(job: Job<unknown>) {
    console.log('reactPostJob - Begin');
    const bodyData: any = job.data;
    this.rfmGatewayService
      .reactedPost(
        bodyData.user.id,
        bodyData.payload.postId,
        bodyData.payload.type
      )
      .then(() => {
        console.log('reactPostJob: OKE');
      });
    console.log('reactPostJob - End');
    return {};
  }

  @Process('comment-post-job')
  async commentPostJob(job: Job<unknown>) {
    console.log('commentPostJob - Begin');
    const bodyData: any = job.data;
    this.rfmGatewayService
      .commentPost(
        bodyData.user.id,
        bodyData.payload.postId,
        bodyData.payload.comment
      )
      .then(() => {
        console.log('reactPostJob: OKE');
      });
    console.log('reactPostJob - End');
    return {};
  }
}
