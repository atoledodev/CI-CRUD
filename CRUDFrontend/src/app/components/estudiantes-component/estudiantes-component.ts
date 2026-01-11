import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { StudentService } from '../../services/student';

@Component({
  selector: 'app-estudiantes-component',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './estudiantes-component.html',
  styleUrl: './estudiantes-component.css',
})
export class EstudiantesComponent implements OnInit {

  estudiantesForm!: FormGroup;
  pestanaActiva = 'registrar';
  estudiantes: any[] = [];
  editando = false;
  idEditando: number | null = null;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.cargarEstudiantes();
  }

  private buildForm() {
    this.estudiantesForm = this.fb.group({
      ci: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]],
      names: ['', Validators.required],
      lastNames: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]],
      address: ['', Validators.required],
      birthDate: ['', Validators.required],
      career: ['', Validators.required],
      semester: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]],
      registerDate: ['', Validators.required],
    });
  }

  save(event: Event) {
    event.preventDefault();

    if (this.estudiantesForm.invalid) {
      this.estudiantesForm.markAllAsTouched();
      return;
    }

    const values = this.estudiantesForm.value;

    if (this.editando && this.idEditando) {
      this.studentService.update(this.idEditando, values).subscribe(() => {
        alert('Estudiante actualizado');
        this.resetForm();
        this.cargarEstudiantes();
      });
    } else {
      this.studentService.create(values).subscribe(() => {
        alert('Estudiante creado');
        this.resetForm();
        this.cargarEstudiantes();
      });
    }
  }

  resetForm() {
    this.estudiantesForm.reset();
    this.editando = false;
    this.idEditando = null;
    this.cambiarPestana('estudiantes');
  }

  editar(est: any) {
    this.estudiantesForm.patchValue(est);
    this.editando = true;
    this.idEditando = est.id;
    this.cambiarPestana('registrar');
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar estudiante?')) return;
    this.studentService.delete(id).subscribe(() => this.cargarEstudiantes());
  }

  cargarEstudiantes() {
    this.studentService.findAll().subscribe(data => this.estudiantes = data);
  }

  cambiarPestana(p: string) {
    this.pestanaActiva = p;
  }
}
