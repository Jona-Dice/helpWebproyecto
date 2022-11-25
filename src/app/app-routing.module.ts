import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TestComponent } from './components/test/test.component';
import { Step1Component } from './components/register/step1/step1.component';
import { Step2Component } from './components/register/step2/step2.component';
import { Step3Component } from './components/register/step3/step3.component';
import { LoginGuard } from './guards/login.guard';
import { UsersComponent } from './components/test/users/users.component';
import { MyCartComponent } from './components/test/my-cart/my-cart.component';

const routes: Routes = [
  { path: 'test', component: TestComponent, canActivate: [LoginGuard], canActivateChild: [LoginGuard],
    children: [
      { path: 'users', component:  UsersComponent }
    ]
  },
  { path: 'register', component: RegisterComponent,
    children: [
      { path: 'step1', component: Step1Component },
      { path: 'step2', component: Step2Component },
      { path: 'step3', component: Step3Component },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
