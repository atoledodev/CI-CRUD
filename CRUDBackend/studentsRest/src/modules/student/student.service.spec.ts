import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { StudentRepository } from './student.repository';
import { StudentDto } from './student.dto';
import { Student } from './student.entity';

describe('StudentService', () => {
  let service: StudentService;
  let repository: StudentRepository;

  const mockStudentRepository = {
    createOne: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    deleteById: jest.fn(),
    updateById: jest.fn(),
  };

  const mockStudentDto: StudentDto = {
    ci: '12345678',
    names: 'Andres Alejandro',
    lastNames: 'Toledo Rojas',
    email: 'aatoledo1@espe.edu.ec',
    phone: '0999999999',
    address: 'Quito, Ecuador',
    birthDate: new Date('2002-10-12'),
    career: 'ITIN',
    semester: '7mo',
    registerDate: new Date('2020-01-15'),
  };

  const mockStudent: Student = {
    id: 1,
    ci: '12345678',
    names: 'Andres Alejandro',
    lastNames: 'Toledo Rojas',
    email: 'aatoledo1@espe.edu.ec',
    phone: '0999999999',
    address: 'Quito, Ecuador',
    birthDate: new Date('2002-10-12'),
    career: 'ITIN',
    semester: '7mo',
    registerDate: new Date('2020-01-15'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: StudentRepository,
          useValue: mockStudentRepository,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    repository = module.get<StudentRepository>(StudentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a student successfully', async () => {
      // Arrange
      mockStudentRepository.createOne.mockResolvedValue(true);

      // Act
      const result = await service.create(mockStudentDto);

      // Assert
      expect(repository.createOne).toHaveBeenCalledWith(mockStudentDto);
      expect(repository.createOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: 'Student created successfully' });
    });
  });

  describe('findAll', () => {
    it('should return all students successfully', async () => {
      // Arrange
      const students = [mockStudent];
      mockStudentRepository.getAll.mockResolvedValue(students);

      // Act
      const result = await service.findAll();

      // Assert
      expect(repository.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(students);
    });
  });

  describe('findOne', () => {
    it('should return a student by id successfully', async () => {
      // Arrange
      const studentId = 1;
      mockStudentRepository.getById.mockResolvedValue(mockStudent);

      // Act
      const result = await service.findOne(studentId);

      // Assert
      expect(repository.getById).toHaveBeenCalledWith(studentId);
      expect(repository.getById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockStudent);
    });

    it('should throw an error when student is not found', async () => {
      // Arrange
      const studentId = 999;
      mockStudentRepository.getById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(studentId)).rejects.toThrow(
        'Student not found',
      );
      expect(repository.getById).toHaveBeenCalledWith(studentId);
      expect(repository.getById).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete a student successfully', async () => {
      // Arrange
      const studentId = 1;
      mockStudentRepository.getById.mockResolvedValue(mockStudent);
      mockStudentRepository.deleteById.mockResolvedValue(true);

      // Act
      const result = await service.remove(studentId);

      // Assert
      expect(repository.getById).toHaveBeenCalledWith(studentId);
      expect(repository.deleteById).toHaveBeenCalledWith(studentId);
      expect(repository.getById).toHaveBeenCalledTimes(1);
      expect(repository.deleteById).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: 'Student deleted successfully' });
    });

    it('should throw an error when trying to delete a non-existing student', async () => {
      // Arrange
      const studentId = 999;
      mockStudentRepository.getById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(studentId)).rejects.toThrow(
        'Student not found',
      );
      expect(repository.getById).toHaveBeenCalledWith(studentId);
      expect(repository.getById).toHaveBeenCalledTimes(1);
      expect(repository.deleteById).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a student successfully', async () => {
      // Arrange
      const studentId = 1;
      const updateDto: StudentDto = {
        ...mockStudentDto,
        names: 'Pedro',
        lastNames: 'Jiménez',
      };
      mockStudentRepository.getById.mockResolvedValue(mockStudent);
      mockStudentRepository.updateById.mockResolvedValue(true);

      // Act
      const result = await service.update(studentId, updateDto);

      // Assert
      expect(repository.getById).toHaveBeenCalledWith(studentId);
      expect(repository.updateById).toHaveBeenCalledWith(studentId, updateDto);
      expect(repository.getById).toHaveBeenCalledTimes(1);
      expect(repository.updateById).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: 'Student updated successfully' });
    });

    it('should throw an error when trying to update a non-existing student', async () => {
      // Arrange
      const studentId = 999;
      mockStudentRepository.getById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(studentId, mockStudentDto)).rejects.toThrow(
        'Student not found',
      );
      expect(repository.getById).toHaveBeenCalledWith(studentId);
      expect(repository.getById).toHaveBeenCalledTimes(1);
      expect(repository.updateById).not.toHaveBeenCalled();
    });
  });
});
