import { z } from "zod";

//

const PaginationOrder = ["ASC", "DESC"] as const
type PaginationOrder = (typeof PaginationOrder)[number]

//

const PaginationSchema = z.object({
    query: z.string().min(1),
    order: z.enum(PaginationOrder),
    limit: z.coerce.number().int(),
    alpha: z.coerce.date(),
    omega: z.coerce.date(),
    offset: z.coerce.number().int(),
})

//

type Pagination = z.infer<typeof PaginationSchema>

//

export { PaginationOrder, PaginationSchema }

export type { Pagination }
