export type AccountUpsertDto = {
  accountId: string;
  name: string;
  status: string;
  parentId?: string;
};
