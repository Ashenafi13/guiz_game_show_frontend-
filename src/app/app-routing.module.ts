import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthSigninComponent } from './demo/pages/authentication/auth-signin/auth-signin.component';



const routes: Routes = [
  {
    path: '',
    component: AuthSigninComponent,
    children: [
      {
        path: '',
        // redirectTo: 'auth',
        pathMatch: 'full',
        loadComponent: () => import('./demo/pages/authentication/auth-signin/auth-signin.component').then((c) => c.AuthSigninComponent)
      }
    ]
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
      },
      {
        path: 'basic',
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'forms',
        loadComponent: () => import('./demo/pages/form-element/form-element').then((c) => c.FormElement)
      },
      {
        path: 'tables',
        loadComponent: () => import('./demo/pages/tables/tbl-bootstrap/tbl-bootstrap.component').then((c) => c.TblBootstrapComponent)
      },
      {
        path: 'apexchart',
        loadComponent: () => import('./demo/pages/core-chart/apex-chart/apex-chart.component').then((c) => c.ApexChartComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/extra/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      },
      {
        path: 'seasons',
        loadComponent: () => import('./demo/pages/seasons/seasons.component').then((c) => c.SeasonsComponent)
      },
      {
        path: 'episodes',
        loadComponent: () => import('./demo/pages/episodes/episodes.component').then((c) => c.EpisodesComponent)
      },
      {
        path: 'questions',
        loadComponent: () => import('./demo/pages/questions/questions.component').then((c) => c.QuestionsComponent)
      },
      {
        path: 'contestants',
        loadComponent: () => import('./demo/pages/contestants/contestants.component').then((c) => c.ContestantsComponent)
      },
      {
        path: 'teams',
        loadComponent: () => import('./demo/pages/teams/teams.component').then((c) => c.TeamsComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./demo/pages/categories/categories.component').then((c) => c.CategoriesComponent)
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/auth-signin/auth-signin.component').then((c) => c.AuthSigninComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/pages/authentication/auth-signup/auth-signup.component').then((c) => c.AuthSignupComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
