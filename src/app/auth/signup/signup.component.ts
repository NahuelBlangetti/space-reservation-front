// signup.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule], // Agrega ReactiveFormsModule aquí
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordRepeat: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      this.apiService.register(formData).subscribe(
        (response) => {
          console.log('Usuario registrado con éxito', response);
          // Aquí puedes redirigir al usuario o mostrar un mensaje
        },
        (error) => {
          console.error('Error al registrar el usuario', error);
        }
      );
    }
  }
}
