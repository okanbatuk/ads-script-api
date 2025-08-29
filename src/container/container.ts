import { Container } from "inversify";
import { PrismaClient } from "@prisma/client";
import {
  AdGroupController,
  CampaignController,
  KeywordController,
} from "../controllers/index.js";
import { TYPES } from "../types/index.js";
import { prisma } from "../models/prisma.js";
import {
  CampaignService,
  AdGroupService,
  KeywordService,
} from "../services/index.js";
import type {
  ICampaignService,
  IAdGroupService,
  IKeywordService,
} from "../interfaces/index.js";

export const container = new Container();

container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);
container
  .bind<ICampaignService>(TYPES.CampaignService)
  .to(CampaignService)
  .inSingletonScope();
container
  .bind<IAdGroupService>(TYPES.AdGroupService)
  .to(AdGroupService)
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
