import type { Account } from "../models/prisma.js";
import type { AccountDto } from "../dtos/index.js";

export interface IAccountService {
  getAll(): Promise<Account[]>;
  create(row: AccountDto): Promise<void>;
}
