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
  ) => {
    const { limit = 50, offset = 0 } = pagination;

    const orderBy = sort
      ? sort.field === "avgQs"
        ? Prisma.raw(`ROUND(AVG("qs"), 2) ${sort.direction}`)
        : Prisma.raw(`"keyword" ${sort.direction}`)
      : Prisma.raw(`"keyword" ASC`);

    console.log(orderBy);

    const sql = Prisma.sql`
      SELECT MIN("id")        AS id,
             "keyword",
             ROUND(AVG("qs"), 2) AS "avgQs",
             COUNT(*) OVER () AS "totalGrp"
      FROM "Keyword"
      WHERE "adGroupId" = ${filter.adGroupId}
        ${filter.start ? Prisma.sql`AND "date" >= ${new Date(filter.start)}::date` : Prisma.empty}
        ${filter.end ? Prisma.sql`AND "date" <= ${new Date(filter.end)}::date` : Prisma.empty}
        AND "qs" IS NOT NULL
      GROUP BY "keyword"
      ORDER BY ${orderBy}
      LIMIT  ${limit}
      OFFSET ${offset};
    `;

    const list = await this.prisma.$queryRaw<
      Array<{
        id: bigint;
        keyword: string;
        avgQs: number;
        totalGrp: number;
      }>
    >(sql);

    const total = list.length > 0 ? Number(list[0].totalGrp) : 0;

    return {
      keywords: list.map((r) => ({
        id: Number(r.id),
        keyword: r.keyword,
        avgQs: Number(r.avgQs),
      })),
      total,
      page: Math.floor(offset / limit) + 1,
      limit: Number(limit),
    };
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
