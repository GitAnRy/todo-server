import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.model';
import { Progect } from 'src/progects/progects.model';
import { ProgectsModule } from 'src/progects/progects.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Progect]),
    ProgectsModule
  ],
  exports: [UsersService]
})
export class UsersModule {}
