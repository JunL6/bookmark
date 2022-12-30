import { Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { GetUser } from "src/auth/decorators";
import { JwtAuthGuard } from "src/user/JWTAuth.guard";
import { BookmarkService } from "./bookmark.service";
import { BookmarkDto } from './dto'

interface Bookmark {
    url: string,
    name: string
}

@Controller('bookmark')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    getBookmark(@Query('bookmarkId') bookmarkId: string, @GetUser('id') userId) {
        if(!bookmarkId) {
            return this.bookmarkService.getBookmarksByUserId(userId);
        }

        console.log("type of bookmarkId: ", typeof bookmarkId)
        return this.bookmarkService.getBookmarkById(parseInt(bookmarkId));
    }

    @Post()
    @UseGuards(JwtAuthGuard)    
    createBookmark(@GetUser('id') userId, @Body() bookmarkDto: BookmarkDto) {
        if (!bookmarkDto.title || !bookmarkDto.link) {
            throw new HttpException('title and link are required', HttpStatus.BAD_REQUEST);
        }

        try {
            return this.bookmarkService.createBookmark(userId, bookmarkDto);
        } catch (error) {
            throw new HttpException('A bookmark with this title already exists', HttpStatus.BAD_REQUEST)
        } 
    }

    @Patch()
    @UseGuards(JwtAuthGuard)    
    editBookmark(@GetUser('id') userId, @Body() bookmark: {bookmarkId: number, bookmarkDto: BookmarkDto}) {
        if (!bookmark.bookmarkDto || !bookmark?.bookmarkDto?.title || !bookmark?.bookmarkDto?.link) {
            throw new HttpException('title and link are required', HttpStatus.BAD_REQUEST);
        }

        return this.bookmarkService.editBookmark(bookmark.bookmarkId, bookmark.bookmarkDto, userId);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    deleteBookmark(@GetUser('id') userId, @Query('bookmarkId') bookmarkId: string) {
        if(!bookmarkId) {
            throw new HttpException('bookmarkId is required', HttpStatus.BAD_REQUEST);
        }

        return this.bookmarkService.deleteBookmark(parseInt(bookmarkId), userId);
    }
}  