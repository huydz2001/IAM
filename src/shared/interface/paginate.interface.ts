export interface IPaginate {
  readonly items: any[];
  readonly paging: {
    readonly totalItems: number;
    readonly itemCount: number;
    readonly itemsPerPage: number;
    readonly totalPages: number;
    readonly currentPage: number;
  };
}
