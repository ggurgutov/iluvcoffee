import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {

    constructor(private readonly coffeesService: CoffeesService) { }

    /* 
    @Get('flavours')
    findAll() {
        return 'This action returns all coffees';
    } */

    /* @Get()
    findAll(@Query() paginationQuery) {
        const { limit, offset } = paginationQuery;
        return `This action returns all coffees. Limit: ${limit}, offset: ${offset}`;
    } */

    @Get()
    findAll() {
        return this.coffeesService.findAll();
    }

    /*  @Get('flavours')
     findAll(@Res() response) {
         return response.status(200).send('This action returns all coffees');
     } */

    /*  @Get(':id')
     findOne(@Param() params) {
         return `This action returns ${params.id} coffee`;
     } */

    /*  @Get(':id')
     findOne(@Param('id') id: string) {
         return `This action returns ${id} coffee`;
     } */

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coffeesService.findOne(id);
    }

    /* @Post()
    create(@Body() body) {
        return body;
    } */
    /* @Post()
    @HttpCode(HttpStatus.GONE)
    create(@Body('name') name: string) {
        return { name };
    } */

    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        return this.coffeesService.create(createCoffeeDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCoffeeDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffeesService.remove(id);
    }
}
