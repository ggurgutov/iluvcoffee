// import { PartialType } from "@nestjs/mapped-types";
import { PartialType } from "@nestjs/swagger";
import { CreateCoffeeDto } from "./create-coffee.dto";

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) { }

