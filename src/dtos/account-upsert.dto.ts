export type AccountUpsertDto = {
  accountId: string;
  name: string;
  status: string;
  type: boolean;
  parentId?: string;
};
