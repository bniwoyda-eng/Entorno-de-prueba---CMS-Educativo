import { ApiProperty } from '@nestjs/swagger';

export class AbstractPaginationResponseDto<T> {
    @ApiProperty({ isArray: true })
    data: T[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    totalPages: number;
}
