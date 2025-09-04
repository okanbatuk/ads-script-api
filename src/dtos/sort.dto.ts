import { Prisma } from "@prisma/client";

export type SortDto = {
  field: keyof Prisma.KeywordOrderByWithRelationInput;
  direction: "asc" | "desc";
};
