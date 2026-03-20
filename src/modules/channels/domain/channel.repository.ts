import { Channel } from './channel.entity';

export const CHANNEL_REPOSITORY = Symbol('CHANNEL_REPOSITORY');

export interface IChannelRepository {
  findAll(): Promise<Channel[]>;
  findById(id: number): Promise<Channel | null>;
  findByName(name: string): Promise<Channel | null>;
  create(data: { name: string; description?: string | null }): Promise<Channel>;
}