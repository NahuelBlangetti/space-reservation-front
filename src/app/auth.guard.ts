import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service'; // Asegúrate de que la ruta es correcta

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.authService.isLoggedIn(); // Método que verifica el estado de autenticación
    console.log('Is authenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('Redirecting to login');
      this.router.navigate(['/']); // Redirige al login si no está autenticado
    }
    
    return isAuthenticated;
  }
    
}
