import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dtos/create-material.dto';
import { UpdateMaterialDto } from './dtos/update-material.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AbstractResponse, AbstractPaginationResponse } from 'src/common/interfaces';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { Material } from './entities/materials.entity';
import { SearchMaterialsDto } from './dtos';

@ApiTags('Material')
@ApiBearerAuth()
@Controller('materials')
export class MaterialsController {
    constructor(private readonly materialsService: MaterialsService) {}

    @Post()
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Create a new material' })
    @ApiResponse({
        status: 201,
        description: 'Material created',
        type: CreateMaterialDto,
    })
    create(@GetUser() user: User, @Body() createMaterialDto: CreateMaterialDto): Promise<AbstractResponse<Material>> {
        return this.materialsService.create(createMaterialDto);
    }

    @Get('backoffice')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Get all materials' })
    @ApiResponse({
        status: 200,
        description: 'List of all materials.',
        type: [CreateMaterialDto],
    })
    findAll(@Query() searchMaterialsDto: SearchMaterialsDto): Promise<AbstractPaginationResponse<Material[]>> {
        return this.materialsService.findAll(searchMaterialsDto);
    }

    @Get('backoffice/:id')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Get a material by id' })
    @ApiResponse({
        status: 200,
        description: 'The material with the given ID.',
        type: CreateMaterialDto,
    })
    findOne(@Param('id') id: string): Promise<AbstractResponse<Material>> {
        return this.materialsService.findOne(id);
    }

    @Patch(':id')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Update a material by id' })
    @ApiResponse({
        status: 200,
        description: 'The material has been successfully updated.',
        type: UpdateMaterialDto,
    })
    update(
        @Param('id') id: string,
        @Body() updateMaterialDto: UpdateMaterialDto
    ): Promise<AbstractResponse<Material>> {
        return this.materialsService.update(id, updateMaterialDto);
    }

    @Delete(':id')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Delete a material by id' })
    @ApiResponse({ status: 204, description: 'The material has been successfully deleted.' })
    remove(@Param('id') id: string): Promise<AbstractResponse<Material>> {
        return this.materialsService.remove(id);
    }
}
