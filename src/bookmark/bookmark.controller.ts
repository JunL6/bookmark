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
    createNewBookmark() {
        const newBookMark = {

            url: "www." + Math.random() + ".com",
            name: "No." + (Math.random() * 10)
        }
        this.bookmarks.push(newBookMark)
        return newBookMark;
    }
}  