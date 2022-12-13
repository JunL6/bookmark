import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { DATABASE_URL } from "../.env_keys";


@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private configSerivce: ConfigService) {
        super({
            datasources: {
                db: {
                    url:  configSerivce.get(DATABASE_URL)
                }
            }
        })
    }
}
