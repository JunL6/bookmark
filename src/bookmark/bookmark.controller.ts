import { Controller, Get, Post } from "@nestjs/common";

interface Bookmark {
    url: string,
    name: string
}

@Controller('bookmark')
export class BookmarkController {
    private bookmarks = [];

    @Get()
    getAllBookmarks() {
        return this.bookmarks;
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

    }
}  