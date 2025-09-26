import { FindManyOptions, Repository } from 'typeorm'
import { PaginationDto } from '../common/dtos/pagination.dto'
import { PaginatedResponse } from '../common'

export const paginateWithRepository = async <T>(
    repo: Repository<T>,
    paginate: Pick<PaginationDto, 'page' | 'limit'>,
    options: FindManyOptions<T> = {},
): Promise<PaginatedResponse<T>> => {
    const take = paginate.limit
    const skip = (paginate.page - 1) * paginate.limit

    const [results, total] = await repo.findAndCount({
        ...options,
        take,
        skip,
    })

    return {
        data: results,
        meta: {
            totalItems: total,
            currentPage: paginate.page,
            totalPages: Math.ceil(total / take),
        },
        message: 'Success',
        statusCode: 200,
    }
}
