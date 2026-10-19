import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUser } from '../../interfaces/auth-user.interface';
import { createUser } from './services/create';
import { findAllUser, FindAllUserOptions } from './services/findall';
import { findOneUser } from './services/findone';
import { updateUser } from './services/update';
import { changePassword } from './services/changePassword';
import { resetPassword } from './services/resetPassword';
import { updateStatus } from './services/updateStatus';
import { removeUser } from './services/remove';
import { syncUser } from './services/syncUser';
import { getUser } from './services/getUser';
import { countAll } from './services/countAll';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return createUser(this.prisma, createUserDto);
  }

  syncUser(departmentId: number) {
    return syncUser(this.prisma, departmentId);
  }

  findAll(user: AuthUser, options?: FindAllUserOptions) {
    return findAllUser(this.prisma, user, options);
  }

  getUser(user: AuthUser, roleId: number) {
    return getUser(this.prisma, user, roleId);
  }

  countAll(user: AuthUser) {
    return countAll(this.prisma, user);
  }

  findOne(id: number) {
    return findOneUser(this.prisma, id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return updateUser(this.prisma, id, updateUserDto);
  }

  updateStatus(id: number, actived: string) {
    return updateStatus(this.prisma, id, actived);
  }

  changePassword(user: AuthUser, id: number, dto: ChangePasswordDto) {
    return changePassword(this.prisma, user, id, dto);
  }

  resetPassword(id: number) {
    return resetPassword(this.prisma, id);
  }

  remove(id: number) {
    return removeUser(this.prisma, id);
  }
}
