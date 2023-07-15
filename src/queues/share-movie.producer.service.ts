import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ShareMovieProducerService {
  constructor(@InjectQueue('share-movie') private shareMovieQueue: Queue) {}

  async createPost(data: any) {
    await this.shareMovieQueue.add('create-post-job', data);
  }

  async shareMovie(data: any) {
    await this.shareMovieQueue.add('share-movie-job', data);
  }

  async reactPost(data: any) {
    await this.shareMovieQueue.add('react-post-job', data);
  }
}
