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
        
        if(user.bookmarks.find(bookmark => bookmark.title === bookmarkDto.title)) {
            console.log("throws an error: a bookmark with this title already eixst")
            throw new Error('A bookmark with this title already exists');
        }
        

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

    async editBookmark(bookmarkId: number, bookmarkDto: BookmarkDto, userId: number) {
        await this.verifyBookmarkBelongsToUser(bookmarkId, userId)
        
        const bookmark: Bookmark = await this.prismaService.bookmark.update({
            where: { id: bookmarkId },
            data: {
                title: bookmarkDto.title,
                description: bookmarkDto.description,
                link: bookmarkDto.link,
            }
        })

        return bookmark;
    }

    async getAllBookmarksByUserId(userId: number) {
        const user: UserWithBookmarks = await this.prismaService.user.findFirst({
            where: { id: userId },
            include: { bookmarks: true }
        })

        return user.bookmarks;
    }

    async getBookmarkById(bookmarkId: number) {
        const bookmark: Bookmark = await this.prismaService.bookmark.findFirst({
            where: { id: bookmarkId }
        })

        return bookmark;
    }

    async deleteBookmark(bookmarkId: number, userId: number) {
        // verify if the bookmark of this bookmarkId belongs to current user
        await this.verifyBookmarkBelongsToUser(bookmarkId, userId)

        const bookmark: Bookmark = await this.prismaService.bookmark.delete({
            where: { id: bookmarkId }
        })

        return bookmark;
    }

    async verifyBookmarkBelongsToUser(bookmarkId: number, userId: number) {
        const user: UserWithBookmarks = await this.prismaService.user.findFirst({
            where: { id: userId },
            include: { bookmarks: true }
        })

        if(!user.bookmarks.find(bookmark => bookmark.id === bookmarkId)) 
            throw new Error('This bookmark does not belong to this user');
    }
    
}
