import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import type { KeywordDto } from "../dtos";
import type { IKeywordService } from "../interfaces";
import { PrismaClient, type Keyword } from "../models/prisma";

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
    const keywords: Keyword[] = rows.map((r: KeywordDto) => ({
      criterionId: BigInt(r.criterionId),
      keyword: r.keyword,
      date: new Date(r.date),
      qs: Number(r.qs),
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
