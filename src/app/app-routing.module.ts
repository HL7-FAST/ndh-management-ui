import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadComponent: () => import('./components/dashboard/admin-dashboard/admin-dashboard.component').then(comp => comp.AdminDashboardComponent) }, 
  { path: 'view-resource', loadComponent: () => import('./components/resource/view-resource/view-resource.component').then(comp => comp.ViewResourceComponent) },
  { path: 'create-resource', loadComponent: () => import('./components/resource/create-resource/create-resource.component').then(comp => comp.CreateResourceComponent)},
  { path: 'update-resource', loadComponent: () => import('./components/resource/update-resource/update-resource.component').then(comp => comp.UpdateResourceComponent)},
  { path: 'delete-resource', loadComponent: () => import('./components/resource/delete-resource/delete-resource.component').then(comp => comp.DeleteResourceComponent)},
  { path: 'endpoint-list', loadComponent: () => import('./components/endpoint/endpoint-list/endpoint-list.component').then(comp => comp.EndpointListComponent) },
  { path: 'organization-list', loadComponent: () => import('./components/organization/organization-list/organization-list.component').then(comp => comp.OrganizationListComponent) },
  { path: 'capability-statement', loadComponent: () => import('./components/capability-statement/capability-statement.component').then(comp => comp.CapabilityStatementComponent) },
  { path: 'themes', loadComponent: () => import('./components/theme-showcase/theme-showcase.component').then(comp => comp.ThemeShowcaseComponent) },
  { path: 'unauthorized', loadComponent: () => import('./components/core/unauthorized/unauthorized.component').then(mod => mod.UnauthorizedComponent) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
