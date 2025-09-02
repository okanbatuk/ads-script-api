import { inject, injectable } from "inversify";
import { TYPES } from "../types/index.js";
import { ApiError } from "../errors/api.error.js";
import type { KeywordDto } from "../dtos/index.js";
import type { IKeywordService } from "../interfaces/index.js";
import { PrismaClient, type Keyword } from "../models/prisma.js";

@injectable()
export class KeywordService implements IKeywordService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}
  getAll(id: string): Promise<Keyword[]> {
    const adGroupId = BigInt(id);
    return this.prisma.keyword.findMany({
      where: { adGroupId },
      orderBy: { keyword: "asc" },
    });
  }
  upsert = async (rows: KeywordDto[]): Promise<void> => {
    console.log(`Keyword Rows: `);
    console.log(rows);
    if (!Array.isArray(rows)) throw new ApiError("Keywords must be an array.");
    if (rows.length === 0) return;
    const keywords: Keyword[] = rows.map((r: KeywordDto) => ({
      criterionId: BigInt(r.criterionId),
      keyword: r.keyword,
      date: new Date(r.date),
      qs: r.qs ? Number(r.qs) : null,
      adGroupId: BigInt(r.adGroupId),
    }));
    await this.prisma.$transaction(
      keywords.map(({ criterionId, keyword, date, qs, adGroupId }) =>
        this.prisma.keyword.upsert({
          where: { criterionId_date: { criterionId, date } },
          update: { keyword, qs, adGroupId },
          create: { criterionId, keyword, date, qs, adGroupId },
        }),
      ),
    );
  };
}
