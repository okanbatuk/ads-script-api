import { Prisma } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";
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
    if (f.start) where.date.gte = startOfDay(new Date(f.start));
    if (f.end) where.date.lte = endOfDay(new Date(f.end));
  }

  return where;
};
