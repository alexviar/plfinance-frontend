export type Params<Filter = never> = {
    search?: string
    filter?: Filter,
    page?: number,
    perPage?: number
  }
  
  export type Paginated<Data> = {
    currentPage: number
    data: Data[]
    firstPageUrl: string
    from: number
    lastPage: number
    lastPageUrl: string
    links: {
        url: string | null
        label: string
        active: boolean
    }[]
    nextPageUrl: string | null
    path: string
    perPage: number
    prevPageUrl: string | null
    to: number
    total: number
  }