import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { UsersModule } from '../users/users.module';
import { ItemsModule } from '../items/items.module';
import { ListsModule } from '../lists/lists.module';
import { ListItemModule } from '../list-item/list-item.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    ItemsModule,
    ListsModule,
    ListItemModule,
  ],
})
export class SeedModule {}
