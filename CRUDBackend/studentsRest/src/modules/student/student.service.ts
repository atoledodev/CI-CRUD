import { Injectable } from '@nestjs/common';
import { StudentRepository } from './student.repository';
import { StudentDto } from './student.dto';
import { Student } from './student.entity';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async create(dto: StudentDto): Promise<{ message: string }> {
    await this.studentRepository.createOne(dto);
    return { message: 'Student created successfully' };
  }

  async findAll(): Promise<Student[]> {
    const student = await this.studentRepository.getAll();
    return student;
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.studentRepository.getById(id);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  }

  async remove(id: number): Promise<{ message: string }> {
    const student = await this.studentRepository.getById(id);
    if (!student) {
      throw new Error('Student not found');
    }
    await this.studentRepository.deleteById(id);
    return { message: 'Student deleted successfully' };
  }

  async update(id: number, dto: StudentDto): Promise<{ message: string }> {
    const student = await this.studentRepository.getById(id);
    if (!student) {
      throw new Error('Student not found');
    }
    await this.studentRepository.updateById(id, dto);
    return { message: 'Student updated successfully' };
  }
}
