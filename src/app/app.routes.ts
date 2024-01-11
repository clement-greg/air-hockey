import { Routes } from '@angular/router';
import { TestHarnessComponent } from './test-harness/test-harness.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {component: TestHarnessComponent,
    path: 'test-harness'},
    {
        component: HomeComponent,
        path: ''
    }
];
