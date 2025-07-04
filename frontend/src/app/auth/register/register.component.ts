import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  styleUrls: ['./register.component.css'],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  user = { name: '', email: '', password: '', role: 'CUSTOMER' };
  isRegistered = false;
  otpForm: FormGroup;
  showOtpCard = false;
  generatedEmail: string = '';
  otp = {
  d1: '', d2: '', d3: '', d4: '', d5: '', d6: ''
};
  registerForm: FormGroup;
  loading=false;


  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder) {

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['CUSTOMER', Validators.required]
    });


     this.otpForm = this.fb.group({
    d1: ['', Validators.required],
    d2: ['', Validators.required],
    d3: ['', Validators.required],
    d4: ['', Validators.required],
    d5: ['', Validators.required],
    d6: ['', Validators.required],
  });
   }

  register() {
    // if (this.registerForm.invalid) {
    //   //this.snackBar.open('Please fill all required fields!', 'Close', { duration: 3000 });
    //   alert('Please fill all required fields!');
    //   return;
    // }
    
  this.loading = true;
    this.auth.register(this.user).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.generatedEmail = this.user.email;
      this.showOtpCard = true;
      },
      error: (error) => {
        this.loading=false;
        console.error('Registration failed', error);
      }
    });
  }
 verifyOtp() {
  const otpValue = this.otp.d1 + this.otp.d2 + this.otp.d3 + this.otp.d4 + this.otp.d5 + this.otp.d6;
 console.log('OTP Value:', otpValue);
  if (otpValue.length !== 6) {
    //this.snackBar.open('Please enter complete 6-digit OTP!', 'Close', { duration: 3000 });
    alert('Please enter complete 6-digit OTP!');
    return;
  }

  this.auth.verifyOtp({ email: this.user.email, otp: otpValue }).subscribe({
    next: () => {
     // this.snackBar.open('Email Verified Successfully!', 'Close', { duration: 3000 });
      alert('Email Verified Successfully!');
      this.showOtpCard = false;
      this.router.navigate(['/login']);
    },
    error: () => {
      //this.snackBar.open('Invalid OTP!', 'Close', { duration: 3000 });
      alert('Invalid OTP!');
      this.otp = { d1: '', d2: '', d3: '', d4: '', d5: '', d6: '' }; 
    }
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
