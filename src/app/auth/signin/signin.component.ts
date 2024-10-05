import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-singin',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule], 
  templateUrl: './signin.component.html', // Ajusta la ruta
  styleUrls: ['./signin.component.css'] // Ajusta la ruta
})
export class SigninComponent{
  loginForm: FormGroup;
  loginError: string = ''; 

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        (response) => {
          console.log('Inicio de sesión exitoso', response);
          localStorage.setItem('access_token', response.access_token);
          this.router.navigate(['/mySpaces']); // Redirigir después de iniciar sesión
        },
        (error) => {
          console.error('Error de inicio de sesión', error);
          alert('Error de inicio de sesión');
        }
      );
    }
  }
  

}
