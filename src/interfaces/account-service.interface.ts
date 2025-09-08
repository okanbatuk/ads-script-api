import { AccountDto } from "../dtos/index.js";

export interface IAccountService {
  create(row: AccountDto): Promise<void>;
}
