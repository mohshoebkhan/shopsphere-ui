import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginData: LoginRequest = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login(): void {

    if (
      !this.loginData.email ||
      !this.loginData.password
    ) {

      alert('Please enter email and password');

      return;
    }

    this.authService.login(
      this.loginData
    ).subscribe({

      next: (response) => {

        this.authService.saveToken(
          response.accessToken
        );

        this.authService.saveRefreshToken(
          response.refreshToken
        );

        this.authService.saveUser(
          response.user
        );

        alert('Login Successful');

        this.router.navigate(['/products']);

      },

      error: (error) => {

        console.error(
          'Login failed:',
          error
        );

        alert(
          error.error?.message ||
          'Invalid Email or Password'
        );

      }

    });

  }

  goToRegister(): void {

    this.router.navigate(['/register']);

  }

}

