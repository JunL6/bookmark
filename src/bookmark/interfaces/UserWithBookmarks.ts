import { Prisma } from '@prisma/client';

const userWithBookmarks = Prisma.validator<Prisma.UserArgs>()({
  include: { bookmarks: true },
})

export type UserWithBookmarks = Prisma.UserGetPayload<typeof userWithBookmarks>