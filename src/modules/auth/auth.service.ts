/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

type User = {
  id: number;
  username: string;
  password: string;
  status: string;
  roleId: number;
  first_name: string | null;
  last_name: string | null;
  emp_code: string | null;
  gender: string | null;
  tel: string | null;
  email: string | null;
  empimg: string | null;
  posId: number | null;
  departmentId: number | null;
  divisionId: number | null;
  officeId: number | null;
  unitId: number | null;
  division: {
    id: number;
    branch_id: number | null;
  } | null;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        status: true,
        roleId: true,
        first_name: true,
        last_name: true,
        emp_code: true,
        gender: true,
        tel: true,
        email: true,
        empimg: true,
        posId: true,
        departmentId: true,
        divisionId: true,
        officeId: true,
        unitId: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        division: {
          select: {
            id: true,
            branch_id: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('ບໍ່​ມີ​ຂໍ້​ມູນຜູ້​ໃຊ້');
    }

    if (user.status !== 'A') {
      throw new ForbiddenException('ລະ​ຫັດ​ຂອງ​ທ່ານ​ໄດ້​ຖືກ​ປິດ​ການ​ໃຊ້​ງານ');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('ລະ​ຫັດ​ຜ່ານ​ບໍ່​ຖືກຕ້ອງ');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      roleId: user.roleId,
      departmentId: user.departmentId ?? null,
      divisionId: user.divisionId ?? null,
      officeId: user.officeId ?? null,
      unitId: user.unitId ?? null,
    };

    const expiresIn = '2h';
    const defaultPassword = process.env.DEFAULT_PASSWORD || 'EDL1234';
    const isDefaultPassword = password === defaultPassword;

    return {
      token: this.jwtService.sign(payload, { expiresIn }),
      user,
      isDefaultPassword,
    };
  }
}
