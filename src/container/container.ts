import { Container } from "inversify";
import { PrismaClient } from "@prisma/client";
import {
  AccountController,
  CampaignController,
  AdGroupController,
  KeywordController,
  GlobalScoreController,
} from "../controllers/index.js";
import {
  AccountService,
  CampaignService,
  AdGroupService,
  KeywordService,
  GlobalScoreService,
} from "../services/index.js";
import type {
  IAccountService,
  ICampaignService,
  IAdGroupService,
  IKeywordService,
  IGlobalScoreService,
} from "../interfaces/index.js";
import { TYPES } from "../types/index.js";
import { prisma } from "../models/prisma.js";

export const container = new Container();

container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);
container
  .bind<IGlobalScoreService>(TYPES.GlobalScoreService)
  .to(GlobalScoreService)
  .inSingletonScope();
container
  .bind<IAccountService>(TYPES.AccountService)
  .to(AccountService)
  .inSingletonScope();
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
  .bind<GlobalScoreController>(TYPES.GlobalScoreController)
  .to(GlobalScoreController)
  .inSingletonScope();
container
  .bind<AccountController>(TYPES.AccountController)
  .to(AccountController)
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
