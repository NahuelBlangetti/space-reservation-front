import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Elimina ReactiveFormsModule y FormsModule de los imports
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule, ToastModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private messageService: MessageService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordRepeat: ['', Validators.required],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    // Aquí puede1s inicializar cualquier cosa si es necesario
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
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Usuario Creado con Exito!', life: 1500, closable: false});
          localStorage.setItem('access_token', response.access_token);
          this.router.navigate(['/']).then(() => {
            location.reload();
          });
        },
        (error) => {
          console.error('Error al registrar el usuario', error);
          if (error.error && error.error.errors) {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al validar el usuario.', life: 1500, closable: false});
          }
        }
      );
    } else {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al validar el usuario.', life: 1500, closable: false});
    }
  }
  

  // Validación personalizada para asegurarse de que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('passwordRepeat')?.value
      ? null : { mismatch: true };
  }
}
