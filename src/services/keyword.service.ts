import { inject, injectable } from "inversify";
import { TYPES } from "../types/index.js";
import { ApiError } from "../errors/api.error.js";
import { prismaKeywordFilter } from "../utils/index.js";
import { Prisma, PrismaClient, type Keyword } from "../models/prisma.js";
import type {
  KeywordDto,
  KeywordFilter,
  Pagination,
  SortDto,
} from "../dtos/index.js";
import type { IKeywordService } from "../interfaces/index.js";

@injectable()
export class KeywordService implements IKeywordService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  getKeywordsByFilter = async (
    filter: KeywordFilter,
    sort: SortDto | undefined,
    pagination: Pagination,
  ): Promise<{ id: number; keyword: string; avgQs: number }[] | []> => {
    const { limit = 50, offset = 0 } = pagination;

    const orderBy: Prisma.KeywordOrderByWithRelationInput = sort
      ? { [sort.field]: sort.direction }
      : { id: "asc" };

    const rows = await this.prisma.keyword.findMany({
      where: prismaKeywordFilter(filter),
      select: { id: true, keyword: true, qs: true },
      orderBy,
      take: limit,
      skip: offset,
    });

    const map = new Map<
      string,
      { ids: number[]; qsTotal: number; count: number }
    >();

    for (const r of rows) {
      if (r.qs === null) continue;
      const key = r.keyword;
      if (!map.has(key)) {
        map.set(key, { ids: [], qsTotal: 0, count: 0 });
      }
      const entry = map.get(key)!;
      entry.ids.push(r.id);
      entry.qsTotal += r.qs;
      entry.count++;
    }

    return Array.from(map.entries()).map(([keyword, v]) => ({
      id: v.ids[0],
      keyword,
      avgQs: Number((v.qsTotal / v.count).toFixed(2)),
    }));
  };

  getLastDate = async (id: string): Promise<Date | null> => {
    const adGroupId = BigInt(id);
    const result = await this.prisma.keyword.findFirst({
      where: { adGroupId },
      orderBy: { date: "desc" },
      select: { date: true },
    });

    return result?.date ?? null;
  };

  upsert = async (rows: KeywordDto[]): Promise<void> => {
    if (!Array.isArray(rows)) throw new ApiError("Keywords must be an array.");
    if (rows.length === 0) return;
    const keywords = rows.map((r: KeywordDto) => ({
      criterionId: BigInt(r.criterionId),
      keyword: r.keyword,
      date: new Date(r.date),
      qs: r.qs ? Number(r.qs) : null,
      adGroupId: BigInt(r.adGroupId),
    }));
    await this.prisma.$transaction(
      keywords.map(({ criterionId, keyword, date, qs, adGroupId }) =>
        this.prisma.keyword.upsert({
          where: {
            criterionId_date_adGroupId: {
              criterionId: criterionId,
              date: date,
              adGroupId: adGroupId,
            },
          },
          update: { qs },
          create: { criterionId, keyword, date, qs, adGroupId },
        }),
      ),
    );
  };
}
