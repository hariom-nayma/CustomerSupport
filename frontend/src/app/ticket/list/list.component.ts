import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
//import { MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  tickets: any[] = [];
  ticketsr: any[] = [];
  displayedColumns: string[] = ['id', 'title', 'priority', 'status', 'created Date', 'view'];

  priorityFilter: string = '';
 idFilter: number | null = null;
 dateFilter: string = '';

 role: string | null = null;

// Filtered tickets getter
filteredTickets() {
  return this.tickets.filter(t => {
    const matchesPriority = this.priorityFilter ? t.priority.toLowerCase().includes(this.priorityFilter.toLowerCase()) : true;
    const matchesId = this.idFilter ? t.id == this.idFilter : true;
    const matchesDate = this.dateFilter ? t.createdAt.startsWith(this.dateFilter) : true;
    return matchesPriority && matchesId && matchesDate;
  });
}


// Status badge color class
getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'open':
      return 'badge-open';
    case 'closed':
      return 'badge-closed';
    case 'in_progress':
      return 'badge-pending';
    case 'resolved':
      return 'badge-resolved';
    default:
      return 'badge-default';
  }
}

 
  constructor(private ticketService: TicketService, private auth: AuthService) {}

    
  
  ngOnInit() {
  this.role = this.auth.getUserRole();
  console.log('User Role:', this.role);
      if (this.role === 'CUSTOMER') {
    this.ticketService.getByUser().subscribe({
      next: (res: any) => this.tickets = res.map((r: any) => {
        r.status = r.status.replace('_', ' ').toUpperCase();
        return r;
      }),
      error: (err) => console.error(err)
    });
  }
    else{
      this.ticketService.getAll().subscribe({
        next: (res: any) => this.tickets = res.map((r: any) => {
        r.status = r.status.replace('_', ' ').toUpperCase();
        return r;
      }),
        error: (err) => console.error(err)
      });
    }
  }

}