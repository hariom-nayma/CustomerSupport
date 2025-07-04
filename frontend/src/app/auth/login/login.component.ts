import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
//import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  credentials = { email: '', password: '' };
  isForgotPassword: boolean = false;
  forgetPasswordMode: boolean = false;
  showOtpCard: boolean = false;
  showResetPassword: boolean = false;

emailForReset: string = '';
otp = { d1: '', d2: '', d3: '', d4: '', d5: '', d6: '' };
newPassword: string = '';
confirmPassword: string = '';


  constructor(
    private authService: AuthService,
    private router: Router,
  // private snackBar: MatSnackBarModule
  ) {}

  login() {
    if (!this.credentials.email || !this.credentials.password) {
     //this.snackBar.open('Please fill all fields!', 'Close', { duration: 2000 });
     alert('Please fill all fields!');
      return;
    }

    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.token);
       // this.snackBar.open('Login Successful!', 'Close', { duration: 2000 });
       alert('Login Successful!');
       // this.authService.setUserRole(res.role);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        alert('Invalid credentials!'+ error?.error?.message);
       // this.snackBar.open('Invalid credentials!', 'Close', { duration: 2000 });
      }
    });
  }

  sendOtp() {
  if (!this.emailForReset || this.emailForReset.trim() === '' || !this.emailForReset.includes('@') || !this.emailForReset.includes('.') || this.emailForReset.length < 5 || this.emailForReset.length > 50) {
    //this.snackBar.open('Please enter your email!', 'Close', { duration: 2000 });
    alert('Please enter valid email!');
    return;
  }
  this.authService.sendOtp(this.emailForReset)
    .subscribe({
      next: () => {
        //this.snackBar.open('OTP sent!', 'Close', { duration: 3000 });
        alert('OTP sent!');
        this.showOtpCard = true;
      },
      error: () => //this.snackBar.open('Failed to send OTP', 'Close')
      alert('Failed to send OTP')
    });
}

verifyPasswordOtp() {
  const otpValue = this.otp.d1 + this.otp.d2 + this.otp.d3 + this.otp.d4 + this.otp.d5 + this.otp.d6;
  if (otpValue.length !== 6) {
   // this.snackBar.open('Enter complete 6-digit OTP!', 'Close');
    alert('Enter complete 6-digit OTP!');
    return;
  }

  this.authService.verifyOtp({
    email: this.emailForReset,
    otp: otpValue
  }).subscribe({
    next: () => {
      //this.snackBar.open('OTP Verified!', 'Close');
      alert('OTP Verified!');
      this.showResetPassword = true;
    },
    error: () => //this.snackBar.open('Invalid OTP', 'Close')
    alert('Invalid OTP')
  });
}

resetPassword() {
  if (this.newPassword !== this.confirmPassword) {
    //this.snackBar.open('Passwords do not match!', 'Close');
    alert('Passwords do not match!');
    return;
  }

  this.authService.resetPassword( {
    email: this.emailForReset,
    newPassword: this.newPassword
  }).subscribe({
    next: () => {
     // this.snackBar.open('Password reset successful!', 'Close');
      alert('Password reset successful!');
      this.forgetPasswordMode = false;
      this.showOtpCard = false;
      this.showResetPassword = false;
    },
    error: () => //this.snackBar.open('Failed to reset password', 'Close')
    alert('Failed to reset password')
  });
}

moveToNext(event: any, nextInput: any) {
  const key = event.key;

  if (key >= '0' && key <= '9' && nextInput) {
    nextInput.focus();
  } else if (key === 'Backspace') {
    const prev = event.target.previousElementSibling;
    if (prev) prev.focus();
  }
}

}
