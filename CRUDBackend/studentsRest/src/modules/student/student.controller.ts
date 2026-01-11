import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentDto } from './student.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async createStudent(@Body() dto: StudentDto) {
    return this.studentService.create(dto);
  }

  @Put(':id')
  async updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: StudentDto,
  ) {
    return this.studentService.update(id, dto);
  }

  @Get()
  async getAllStudents() {
    return this.studentService.findAll();
  }

  @Get(':id')
  async getStudentById(@Param('id') id: number) {
    return this.studentService.findOne(id);
  }

  @Delete(':id')
  async deleteStudent(@Param('id') id: number) {
    return this.studentService.remove(id);
  }
}
