import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../types/index.js";
import { Prisma } from "../models/prisma.js";
import { sendResponse } from "../utils/index.js";
import { KeywordFilter, SortDto } from "../dtos/index.js";
import type { IKeywordService } from "../interfaces/index.js";

@injectable()
export class KeywordController {
  constructor(
    @inject(TYPES.KeywordService) private readonly service: IKeywordService,
  ) {}

  resolveQuery = (query: any) => {
    const { limit, offset, sort, ...rest } = query;
    const search = Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    ) as Omit<KeywordFilter, "id">;

    type KeywordOrderField = keyof Prisma.KeywordOrderByWithRelationInput;

    const allowed: KeywordOrderField[] = ["id", "keyword", "qs"];

    let sortObj: SortDto | undefined;

    if (typeof sort === "string") {
      const [rawField, dir] = sort.split(":");
      const field = rawField as KeywordOrderField;
      if (allowed.includes(field)) {
        sortObj = { field, direction: dir === "desc" ? "desc" : "asc" };
      }
    }
    return {
      pagination: {
        limit: Math.max(1, Number(query.limit) || 50),
        offset: Math.max(0, Number(query.offset) || 0),
      },
      sort: sortObj,
      search,
    };
  };

  getKeywordsByFilter = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { pagination, sort, search } = this.resolveQuery(req.query);
    const filter: KeywordFilter = {
      ...search,
      adGroupId: BigInt(req.params.id),
    };
    const result = await this.service.getKeywordsByFilter(
      filter,
      sort,
      pagination,
    );
    return sendResponse(
      res,
      200,
      result,
      "All filtered keywords successfully retrieved.",
    );
  };

  getLastDate = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.service.getLastDate(req.params.id);
    return sendResponse(
      res,
      200,
      { date: result },
      "Date information of the last added keywords has been retrieved.",
    );
  };

  upsert = async (req: Request, res: Response): Promise<Response> => {
    console.log(`------- UPSERT Campaigns --------`);
    await this.service.upsert(req.body);
    return sendResponse(
      res,
      201,
      undefined,
      "Keywords created successfully retrieved.",
    );
  };
}
