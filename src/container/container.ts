import { Container } from "inversify";
import { PrismaClient } from "@prisma/client";
import {
  AdGroupController,
  CampaignController,
  KeywordController,
} from "../controllers";
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

container
  .bind<CampaignController>(TYPES.CampaignController)
  .to(CampaignController)
  .inSingletonScope();
container
  .bind<AdGroupController>(TYPES.AdGroupController)
  .to(AdGroupController)
  .inSingletonScope();
container
  .bind<KeywordController>(TYPES.KeywordController)
  .to(KeywordController)
  .inSingletonScope();
