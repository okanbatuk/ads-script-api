import { inject, injectable } from "inversify";
import {
  type Account,
  type AccountStatus,
  PrismaClient,
} from "../models/prisma.js";
import { TYPES } from "../types/index.js";
import { AccountDto } from "../dtos/index.js";
import { ApiError } from "../errors/api.error.js";
import { IAccountService } from "../interfaces/index.js";

@injectable()
export class AccountService implements IAccountService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}
  create = async (row: AccountDto): Promise<void> => {
    if (!row) throw new ApiError("Account cannot be null.");
    const account: Account = {
      id: BigInt(row.id),
      name: row.name,
      status: row.status.toUpperCase() as AccountStatus,
    };
    await this.prisma.account.create({ data: account });
  };
}
