import { KeywordFilter } from "./keyword-filter.dto";
import { Pagination } from "./pagination.dto";

export type KeywordSearchFilter = Omit<KeywordFilter, "id"> & Pagination;
