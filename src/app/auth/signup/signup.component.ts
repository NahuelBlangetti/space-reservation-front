import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Elimina ReactiveFormsModule y FormsModule de los imports
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule], // Aquí importas ReactiveFormsModule
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required], // Cambiado a 'name'
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordRepeat: ['', Validators.required],
    }, {
      validators: this.passwordMatchValidator // Añadir validación para confirmar la contraseña
    });
  }

  ngOnInit() {
    // Aquí puedes inicializar cualquier cosa si es necesario
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        password_confirmation: this.registerForm.value.passwordRepeat, // Aquí hacemos el cambio
      };
  
      this.apiService.register(formData).subscribe(
        (response) => {
          console.log('Usuario registrado con éxito', response);
          localStorage.setItem('access_token', response.access_token);
          this.router.navigate(['/mySpaces']);
        },
        (error) => {
          console.error('Error al registrar el usuario', error);
          if (error.error && error.error.errors) {
            console.log('Errores de validación:', error.error.errors);
          }
        }
      );
    } else {
      console.log('Formulario no válido', this.registerForm.errors);
    }
  }
  

  // Validación personalizada para asegurarse de que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('passwordRepeat')?.value
      ? null : { mismatch: true };
  }
}
