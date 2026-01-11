import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn({ name: 'student_id' })
  id: number;

  @Column({ name: 'ci' })
  ci: string;

  @Column({ name: 'names' })
  names: string;

  @Column({ name: 'last_names' })
  lastNames: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'address' })
  address: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ name: 'career' })
  career: string;

  @Column({ name: 'semester' })
  semester: string;

  @Column({ name: 'register_date', type: 'date' })
  registerDate: Date;
}
