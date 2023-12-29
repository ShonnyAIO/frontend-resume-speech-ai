import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/home/home.routes').then(m => m.routes)
    },
    /* NO ACCESS */
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
