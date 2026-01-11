import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { EstudiantesComponent } from './estudiantes-component';
import { StudentService } from '../../services/student';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EstudiantesComponent', () => {
  let component: EstudiantesComponent;
  let fixture: ComponentFixture<EstudiantesComponent>;
  let mockStudentService: jasmine.SpyObj<StudentService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  const mockStudent = {
    id: 1,
    ci: '12345678',
    names: 'Andres Alejandro',
    lastNames: 'Toledo Rojas',
    email: 'aatoledo1@espe.edu.ec',
    phone: '0999999999',
    address: 'Quito, Ecuador',
    birthDate: '2002-10-12',
    career: 'ITIN',
    semester: '7mo',
    registerDate: '2020-01-15',
  };

  beforeEach(async () => {
    const studentServiceSpy = jasmine.createSpyObj('StudentService', [
      'create',
      'findAll',
      'update',
      'delete',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMock = {
      snapshot: { params: {} },
      paramMap: of(new Map()),
      queryParamMap: of(new Map()),
    };

    await TestBed.configureTestingModule({
      imports: [EstudiantesComponent, ReactiveFormsModule],
      providers: [
        { provide: StudentService, useValue: studentServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Para ignorar elementos desconocidos
    }).compileComponents();

    fixture = TestBed.createComponent(EstudiantesComponent);
    component = fixture.componentInstance;
    mockStudentService = TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup default mocks
    mockStudentService.findAll.and.returnValue(of([mockStudent]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TEST 1: Validación de formulario con datos mock
  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should validate form correctly with valid mock data', () => {
      component.estudiantesForm.patchValue({
        ci: '1234567890', // 10 dígitos válidos
        names: 'Andres Alejandro',
        lastNames: 'Toledo Rojas',
        email: 'aatoledo1@espe.edu.ec',
        phone: '0999999999',
        address: 'Quito, Ecuador',
        birthDate: '2002-10-12',
        career: 'ITIN',
        semester: '7',
        registerDate: '2020-01-15',
      });

      expect(component.estudiantesForm.valid).toBeTruthy();
      expect(component.estudiantesForm.get('ci')?.errors).toBeNull();
      expect(component.estudiantesForm.get('email')?.errors).toBeNull();
      expect(component.estudiantesForm.get('phone')?.errors).toBeNull();
    });

    it('should invalidate form with wrong data formats', () => {
      component.estudiantesForm.patchValue({
        ci: '12345678', // Solo 8 dígitos (inválido)
        names: '', // Campo requerido vacío
        email: 'email-invalido',
        phone: '099999999a', // Contiene letra
        semester: 'abc', // No es número
      });

      expect(component.estudiantesForm.invalid).toBeTruthy();
      expect(component.estudiantesForm.get('ci')?.hasError('minlength')).toBeTruthy();
      expect(component.estudiantesForm.get('names')?.hasError('required')).toBeTruthy();
      expect(component.estudiantesForm.get('email')?.hasError('email')).toBeTruthy();
      expect(component.estudiantesForm.get('phone')?.hasError('pattern')).toBeTruthy();
      expect(component.estudiantesForm.get('semester')?.hasError('pattern')).toBeTruthy();
    });
  });

  // TEST 2: Operaciones de creación y edición
  describe('Save Operations', () => {
    beforeEach(() => {
      component.ngOnInit();
      spyOn(window, 'alert'); // Mock alert
    });

    it('should create new student successfully', () => {
      mockStudentService.create.and.returnValue(of(mockStudent));

      component.estudiantesForm.patchValue({
        ci: '1234567890',
        names: 'Andres Alejandro',
        lastNames: 'Toledo Rojas',
        email: 'aatoledo1@espe.edu.ec',
        phone: '0999999999',
        address: 'Quito, Ecuador',
        birthDate: '2002-10-12',
        career: 'ITIN',
        semester: '7',
        registerDate: '2020-01-15',
      });

      const event = new Event('submit');
      spyOn(event, 'preventDefault');

      component.save(event);

      expect(mockStudentService.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          names: 'Andres Alejandro',
          email: 'aatoledo1@espe.edu.ec',
        })
      );
      expect(window.alert).toHaveBeenCalledWith('Estudiante creado');
    });

    it('should not save invalid form', () => {
      component.estudiantesForm.patchValue({
        ci: '', // Required field empty
        names: '',
        email: 'invalid-email',
      });

      const event = new Event('submit');
      spyOn(event, 'preventDefault');
      component.save(event);

      expect(mockStudentService.create).not.toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  // TEST 3: Operaciones de eliminación y carga
  describe('Delete and Load Operations', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should delete student with confirmation', () => {
      mockStudentService.delete.and.returnValue(of({}));
      spyOn(window, 'confirm').and.returnValue(true);

      component.eliminar(1);

      expect(window.confirm).toHaveBeenCalledWith('¿Eliminar estudiante?');
      expect(mockStudentService.delete).toHaveBeenCalledWith(1);
      expect(mockStudentService.findAll).toHaveBeenCalled(); // Recarga la lista
    });

    it('should not delete student without confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.eliminar(1);

      expect(mockStudentService.delete).not.toHaveBeenCalled();
    });
  });

  // TEST 4: Estados del componente y navegación
  describe('Component State Management', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should handle edit mode correctly', () => {
      const studentToEdit = {
        id: 1,
        ci: '1234567890',
        names: 'Andres Alejandro',
        lastNames: 'Toledo Rojas',
        email: 'aatoledo1@espe.edu.ec',
        phone: '0999999999',
        address: 'Quito, Ecuador',
        birthDate: '2002-10-12',
        career: 'ITIN',
        semester: '7',
        registerDate: '2020-01-15',
      };

      component.editar(studentToEdit);

      expect(component.editando).toBeTruthy();
      expect(component.idEditando).toBe(1);
      expect(component.pestanaActiva).toBe('registrar');
      expect(component.estudiantesForm.get('names')?.value).toBe('Andres Alejandro');
      expect(component.estudiantesForm.get('email')?.value).toBe('aatoledo1@espe.edu.ec');
    });

    it('should reset form and state correctly', () => {
      // Simular estado de edición
      component.editando = true;
      component.idEditando = 1;
      component.pestanaActiva = 'registrar';
      component.estudiantesForm.patchValue({ names: 'Test Name' });

      component.resetForm();

      expect(component.editando).toBeFalsy();
      expect(component.idEditando).toBeNull();
      expect(component.pestanaActiva).toBe('estudiantes');
      expect(component.estudiantesForm.get('names')?.value).toBeNull();
    });

    it('should change tabs correctly', () => {
      component.cambiarPestana('estudiantes');
      expect(component.pestanaActiva).toBe('estudiantes');

      component.cambiarPestana('registrar');
      expect(component.pestanaActiva).toBe('registrar');
    });
  });
});
