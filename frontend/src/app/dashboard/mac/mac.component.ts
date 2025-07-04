import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mac',
  imports: [RouterLink, CommonModule],
  templateUrl: './mac.component.html',
  styleUrl: './mac.component.css'
})
export class MacComponent implements OnInit, OnDestroy {

  activeSection: string = '';
  user: any;
  isAdmin: boolean = false;
  isCustomer: boolean = false;
  role: string | null = null;

  // Data lists
  // tickets: any[] = [];
  // comments: any[] = [];
  // notifications: string[] = [];

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.getUser();

    // Role subscription
     this.auth.currentRole.subscribe(role => {
      this.role = role;
      console.log('Current role:', this.role);

      this.isAdmin = (this.role === 'ADMIN');
      this.isCustomer = (this.role === 'CUSTOMER');

      console.log('isAdmin:', this.isAdmin);
      console.log('isCustomer:', this.isCustomer);
    });

  //   // Connect WebSocket
  //   this.ws.connect();

  //   // Subscribe to ticket updates
  //   this.ws.ticketUpdates$.subscribe(message => {
  //     const ticket = JSON.parse(message);
  //     this.tickets.unshift(ticket);
  //     alert('🎟️ New Ticket Arrived');
  //     console.log("📢 New Ticket:", message);
  //   });

  //   // Subscribe to comment updates
  //   this.ws.commentUpdates$.subscribe(message => {
  //     const comment = JSON.parse(message);
  //     this.comments.unshift(comment);
  //     alert('💬 New Comment Arrived');
  //     console.log("💬 New Comment:", message);
  //   });

  //   // Subscribe to notifications
  // this.ws.notifications$.subscribe(message => {
  //     this.notifications.unshift(message);
  //     alert('🔔 ' + message);
  //     console.log("🔔 Notification:", message);
  //   });
  }

  getUser() {
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

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  ngOnDestroy(): void {

    // Disconnect WebSocket
    //this.ws.disconnect();

    console.log("✔️ Cleaned up MacComponent resources.");
  }
}
