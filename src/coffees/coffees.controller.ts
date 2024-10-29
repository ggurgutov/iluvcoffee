import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res, SetMetadata, UsePipes, ValidationPipe } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from "../common/dto/pagination-query.dto"
import { Public } from '../common/decorators/public.decorator';
import { ParseIntPipe } from '../common/pipes/parse-int';
import { Protocol } from '../common/decorators/protoccol.decorator';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('coffees')
// @UsePipes(ValidationPipe)
@Controller('coffees')
export class CoffeesController {

    constructor(private readonly coffeesService: CoffeesService) { }

    // @ApiResponse({
    //     status: 403,
    //     description: 'Forbidden.'
    // })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    // @SetMetadata('isPublic', true)
    @Public()
    @UsePipes(ValidationPipe)
    @Get()
    async findAll(@Protocol('https') protocol: string, @Query() paginatedQuery: PaginationQueryDto) {
        console.log('==Protocol', protocol);
        // await new Promise(resolve => setTimeout(resolve, 5000)); // to test timeout interceptor
        return this.coffeesService.findAll(paginatedQuery);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: string) {
        return this.coffeesService.findOne(id);
    }


    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffeeDto);
    }

    @Patch(':id')
    // update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    update(@Param('id') id: string, @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCoffeeDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffeesService.remove(id);
    }
}
