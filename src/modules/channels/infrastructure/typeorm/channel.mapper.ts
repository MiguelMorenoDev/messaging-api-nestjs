import { Channel } from '../../domain/channel.entity';
import { ChannelOrmEntity } from './channel.typeorm-entity';

export class ChannelMapper {

  static toDomain(orm: ChannelOrmEntity): Channel {
    return new Channel(
      orm.id,
      orm.name,
      orm.description,
    );
  }

  static toOrm(data: { name: string; description?: string | null }): ChannelOrmEntity {
    const orm = new ChannelOrmEntity();
    orm.name = data.name;
    orm.description = data.description ?? null;
    return orm;
  }
}