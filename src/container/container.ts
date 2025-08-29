import { Container } from "inversify";
import { PrismaClient } from "@prisma/client";
import { TYPES } from "../types";
import { prisma } from "../models/prisma";
import { CampaignService, KeywordService } from "../services";
import type { ICampaignService, IKeywordService } from "../interfaces";

export const container = new Container();

container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);
container
  .bind<ICampaignService>(TYPES.CampaignService)
  .to(CampaignService)
  .inSingletonScope();
container
  .bind<IKeywordService>(TYPES.KeywordService)
  .to(KeywordService)
  .inSingletonScope();
