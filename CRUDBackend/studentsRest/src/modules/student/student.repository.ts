import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Student } from './student.entity';
import { StudentDto } from './student.dto';

@Injectable()
export class StudentRepository extends Repository<Student> {
  constructor(private readonly dataSource: DataSource) {
    super(Student, dataSource.createEntityManager());
  }

  async createOne(dto: StudentDto) {
    const student = this.create(dto);
    await this.save(student);
    return true;
  }

  async getAll(): Promise<Student[]> {
    return this.find();
  }

  async getById(id: number): Promise<Student | null> {
    return this.findOneBy({ id });
  }

  async deleteById(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async updateById(id: number, dto: StudentDto): Promise<boolean> {
    const result = await this.update(id, dto);
    return (result.affected ?? 0) > 0;
  }
}
