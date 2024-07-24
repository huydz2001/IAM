import { IPaginate } from 'src/shared/interface/paginate.interface';

export function createPagination<T>(
  items: T[],
  totalItems: number,
  currentPage: number,
  limit: number,
): IPaginate {
  return {
    items,
    paging: {
      totalItems,
      itemCount: items.length,
      itemsPerPage: Number(limit),
      totalPages: Math.ceil(totalItems / limit),
      currentPage: Number(currentPage),
    },
  };
}
