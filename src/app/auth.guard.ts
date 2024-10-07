import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Asegúrate de que la ruta es correcta

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.authService.isLoggedIn(); 
    console.log('Is authenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('Redirecting to login');
      this.router.navigate(['/']); 
    }
    
    return isAuthenticated;
  }
}
