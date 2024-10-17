import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.model';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ProgectsService } from 'src/progects/progects.service';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @Inject(forwardRef(() => ProgectsService))
        private progectService: ProgectsService
    ) {}

    async createUser(dto: CreateUserDto): Promise<User> {
        const user = this.userRepository.save(dto);
        return user;
    }

    async getOnlyUserById(byId: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                id: byId,
            }
        });

        if(user) {
            return user;
        }
        
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    async getUserById(byId: number, paramUser: User): Promise<User> {

        if(paramUser && byId !== paramUser.id) {
            throw new HttpException('Нет прав доступа', HttpStatus.NOT_FOUND);
        }

        const user = await this.userRepository.findOne({
            where: {
                id: byId,
            }, 
            relations: {
                progects: true,

            }
        });

        if(user) {
            return user;
        }
        
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    async getUserByNickname(nick: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                nickname: nick,
            }, 
            relations: {
                progects: true,

            }
        });
        
        return user;
    }

    async deleteUser(byId: number, paramUser: User): Promise<Boolean> {

        const user = await this.getUserById(byId, paramUser);

        if(user.progects.length > 0) {
            for(let progect of user.progects) {
                await this.progectService.deleteProgect(progect.id, null);
            }
        }

        const c = await this.userRepository.delete(byId);

        return c.affected > 0;
    }


}
