import { Routes } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MyspacesComponent } from './myspaces/myspaces.component';
import { AuthGuard } from './auth.guard';



export const routes: Routes = [
    {path: '', component: HomeComponent},

    {path: 'signin', component: SigninComponent},

    {path: 'signup', component: SignupComponent},

    {path: 'mySpaces', component: MyspacesComponent, canActivate: [AuthGuard]},
];

