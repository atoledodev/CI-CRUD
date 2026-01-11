import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing-component/landing-component';
import { EstudiantesComponent } from './components/estudiantes-component/estudiantes-component';

export const routes: Routes = [
    {
        path: '',
        component: LandingComponent
    },
    {
        path: 'portal',
        component: EstudiantesComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
