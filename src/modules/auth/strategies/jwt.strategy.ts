import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

interface CachedUserEntry {
  user: any;
  expiresAt: number;
}

const USER_CACHE_TTL_MS = 30 * 1000; // 30-second TTL
const userCache = new Map<number, CachedUserEntry>();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const cookieExtractor = (req: Request) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['token'];
      }
      return token;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { sub: number }) {
    const now = Date.now();
    const cached = userCache.get(payload.sub);
    if (cached && cached.expiresAt > now) {
      return cached.user;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        username: true,
        roleId: true,
        status: true,
        first_name: true,
        last_name: true,
        emp_code: true,
        gender: true,
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
      userCache.delete(payload.sub);
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== 'A') {
      userCache.delete(payload.sub);
      throw new UnauthorizedException('User account is inactive');
    }

    userCache.set(payload.sub, {
      user,
      expiresAt: now + USER_CACHE_TTL_MS,
    });

    if (userCache.size > 2000) {
      for (const [key, entry] of userCache.entries()) {
        if (entry.expiresAt <= now) {
          userCache.delete(key);
        }
      }
    }

    return user;
  }
}
