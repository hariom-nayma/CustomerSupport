import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  users: any[] = [];
 displayedColumns: string[] = ['Name', 'Email', 'Role'];
  typeFilter: string = '';
 emailFilter: string = '';
 nameFilter: string = '';
 dateFilter: string = '';


  constructor(private router: Router, private auth:AuthService) { }

  // Filter user
filteredUsers() {
  return this.users.filter(t => {
    const matchesRole = this.typeFilter ? t.role.toLowerCase().includes(this.typeFilter.toLowerCase()) : true;
    const matchesId = this.emailFilter ? t.email.toLowerCase().includes(this.emailFilter.toLowerCase()) : true;
    const matchesName = this.nameFilter ? t.name.toLowerCase().includes(this.nameFilter.toLowerCase()) : true;
    const matchesDate = this.dateFilter ? t.createdAt.startsWith(this.dateFilter) : true;
    return matchesRole && matchesId && matchesDate && matchesName;
  });
}
getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'open':
      return 'badge-open';
    case 'closed':
      return 'badge-closed';
    case 'pending':
      return 'badge-pending';
    default:
      return 'badge-default';
  }
}

  ngOnInit(): void {
    // Check if the user is logged in
    if (!this.auth.getToken()) {
      this.router.navigate(['/login']);
    }

    this.auth.getUsers().subscribe({
      next: (response: any) => {
        this.users = response;
        console.log('Users fetched successfully:', response);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        alert('Failed to fetch users. Please try again later.');
      }
    });
  }


}
