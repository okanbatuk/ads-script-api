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

  if (f.startDate || f.endDate) {
    where.date = {};
    if (f.startDate) where.date.gte = new Date(f.startDate);
    if (f.endDate) where.date.lte = new Date(f.endDate);
  }

  return where;
};
