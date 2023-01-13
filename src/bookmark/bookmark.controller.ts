import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
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
    getBookmarks(@GetUser('id') userId) {
        return this.bookmarkService.getAllBookmarksByUserId(userId);

    }

    @Get(':bookmarkId')
    @UseGuards(JwtAuthGuard)
    getBookmarkById(@Param('bookmarkId') bookmarkId: string, @GetUser('id') userId) {
        if(!bookmarkId) {
            return this.bookmarkService.getAllBookmarksByUserId(userId);
        }

        return this.bookmarkService.getBookmarkById(parseInt(bookmarkId));
    }

    @Post()
    @UseGuards(JwtAuthGuard)    
    async createBookmark(@GetUser('id') userId, @Body() bookmarkDto: BookmarkDto) {
        if (!bookmarkDto.title || !bookmarkDto.link) {
            throw new HttpException('title and link are required', HttpStatus.BAD_REQUEST);
        }

        try {
            return await this.bookmarkService.createBookmark(userId, bookmarkDto);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        } 
    }

    @Patch()
    @UseGuards(JwtAuthGuard)    
    async editBookmarkById(@GetUser('id') userId, @Query('bookmarkId') bookmarkId, @Body() bookmarkDto: BookmarkDto) {
        if (!bookmarkDto || !bookmarkDto?.title || !bookmarkDto?.link) {
            throw new HttpException('title and link are required', HttpStatus.BAD_REQUEST);
        }
        
        try {
            return await this.bookmarkService.editBookmarkById(parseInt(bookmarkId), bookmarkDto, userId);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async deleteBookmarkById(@GetUser('id') userId, @Query('bookmarkId') bookmarkId: string) {
        if(!bookmarkId) {
            throw new HttpException('bookmarkId is required', HttpStatus.BAD_REQUEST);
        }

        try {
            return await this.bookmarkService.deleteBookmarkById(parseInt(bookmarkId), userId);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }

    }
}  