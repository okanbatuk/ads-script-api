import { Prisma } from "@prisma/client";
import { KeywordFilter } from "../dtos";

export const prismaKeywordFilter = (
  f: KeywordFilter,
): Prisma.KeywordWhereInput => {
  const where: Prisma.KeywordWhereInput = {
    adGroupId: f.adGroupId,
  };

  if (f.keyword) {
    where.keyword = {
      contains: f.keyword,
      mode: "insensitive",
    };
  }

  if (f.start || f.end) {
    where.date = {};
    if (f.start) {
      const d = new Date(f.start);
      d.setUTCHours(0, 0, 0, 0);
      where.date.gte = d;
    }
    if (f.end) {
      const d = new Date(f.end);
      d.setUTCHours(23, 59, 59, 999);
      where.date.lte = d;
    }
  }

  return where;
};
