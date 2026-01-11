import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = 'http://localhost:3000/students';

  constructor(private http: HttpClient) {}

  // CREATE - con formato de datos
  create(student: any): Observable<any> {
    const formattedStudent = this.formatearDatos(student);
    console.log('Enviando al backend:', formattedStudent);
    return this.http.post(this.apiUrl, formattedStudent);
  }

  // READ
  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // UPDATE - con formato de datos
  update(id: number, student: any): Observable<any> {
    const formattedStudent = this.formatearDatos(student);
    console.log('Actualizando en backend:', formattedStudent);
    return this.http.put(`${this.apiUrl}/${id}`, formattedStudent);
  }

  // DELETE
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Método auxiliar para limpiar y formatear datos
  private formatearDatos(student: any): any {
    return {
      ci: this.limpiarTexto(student.ci),
      names: this.limpiarTexto(student.names),
      lastNames: this.limpiarTexto(student.lastNames),
      email: this.limpiarTexto(student.email),
      phone: this.limpiarTexto(student.phone),
      address: this.limpiarTexto(student.address),
      birthDate: this.formatearFecha(student.birthDate),
      career: this.limpiarTexto(student.career),
      semester: this.limpiarTexto(student.semester),
      registerDate: this.formatearFecha(student.registerDate),
    };
  }

  // Limpiar texto (trim y convertir vacío a string vacío)
  private limpiarTexto(valor: any): string {
    if (!valor || valor === null || valor === undefined) {
      return '';
    }
    return String(valor).trim();
  }

  // Formatear fecha al formato correcto YYYY-MM-DD
  private formatearFecha(fecha: any): string | null {
    if (!fecha || fecha === null || fecha === undefined || fecha === '') {
      return null;
    }

    // Si ya es una fecha válida en formato YYYY-MM-DD
    if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return fecha;
    }

    // Intentar crear fecha y formatear
    try {
      const date = new Date(fecha);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch (error) {
      console.error('Error al formatear fecha:', fecha, error);
    }

    return null;
  }
}
