import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [RouterLink, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  isAdmin: boolean = false;
  isCustomer: boolean = false;
  user: any;
 role: string | null = null;

constructor(private  router: Router , private auth: AuthService){}
ngOnInit(): void {
  this.auth.currentRole.subscribe(role => {
    this.role = role;
    console.log('Current role:', this.role);
    this.getUser();
    console.log('User :', this.user);
  });
  
    const userRole = this.auth.getUserRole();
    if (this.role === 'ADMIN') {
      this.isAdmin = true;
      console.log('isAdmin:', this.isAdmin);
    } else if (userRole === 'CUSTOMER') {
      this.isCustomer = true;
    }
  }


  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }

  getUser(){
    this.auth.getCurrentUser().subscribe({
      next: (res: any) => {
        this.user = res;
        console.log('Current User:', this.user);
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
      }
    });
  }

  

}

