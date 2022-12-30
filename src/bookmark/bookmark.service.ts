import { Injectable } from '@nestjs/common';
import { Bookmark, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkDto } from './dto';
import { UserWithBookmarks } from './interfaces';

@Injectable()
export class BookmarkService {
    constructor(private prismaService: PrismaService) {
        
    }

    async createBookmark(userId: number, bookmarkDto: BookmarkDto) {
        // verify if a bookmark of this user with the same title already exists
        const user: UserWithBookmarks = await this.prismaService.user.findFirst({
            where: { id: userId },
            include: { bookmarks: true }
        })

        // TODO: how to handle errors? (who to throw errors? who to handle errors?)
        if(user.bookmarks.find(bookmark => bookmark.title === bookmarkDto.title)) 
            throw new Error('A bookmark with this title already exists');

        const bookmark = await this.prismaService.bookmark.create({
            data: {
                title: bookmarkDto.title,
                description: bookmarkDto.description,
                link: bookmarkDto.link,
                userId
            }
        })

        return bookmark;
    }

    
}
