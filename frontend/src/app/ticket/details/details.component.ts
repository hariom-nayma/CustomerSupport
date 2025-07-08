import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { CommentService } from '../../services/comment.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './details.component.html',
  
  styleUrl: './details.component.css'
  
  
})
export class DetailsComponent implements OnInit {
  ticket: any;
  comments: any[] = [];
  commentForm: any;
  ticketId!: number;
 role: string | null = null;
 userEmail: string = '';

  constructor(private route: ActivatedRoute , private ticketService: TicketService, private commentService: CommentService, private fb: FormBuilder, private auth: AuthService) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
      internal: [false]
    });
  }

  ngOnInit(): void {
    this.ticketId = this.route.snapshot.params['id'];
    this.loadTicket();
    this.loadComments();

    console.log('Comments '+ this.comments);
     this.auth.currentRole.subscribe(role => {
    this.role = role;
    console.log('Current role:', this.role);
  });
  
    this.userEmail = this.auth.getUserEmail();
    console.log('User Email:', this.userEmail);
  }

  loadTicket(){
     this.ticketService.getById(this.ticketId).subscribe({
      next: (res: any) => this.ticket = res,
      error: () => //this.snackBar.open('Failed to load ticket!', 'Close', { duration: 2000 })
      alert('Failed to load ticket!')
    });
  }

   loadComments() {
    this.commentService.getComments(this.ticketId).subscribe({
      next: (res: any) => this.comments = res,
      error: () => //this.snackBar.open('Failed to load comments!', 'Close', { duration: 2000 })
      alert('Failed to load comments!')
    });
    console.log('Comments loaded:', this.comments);
  }

   addComment() {

    this.commentService.addComment(this.ticketId, this.commentForm.value).subscribe({
      next: () => {
       // this.snackBar.open('Comment added!', 'Close', { duration: 2000 });
        alert('Comment added!');
        this.loadComments();
        this.commentForm.reset({ internal: false });
      },
      error: () => //this.snackBar.open('Failed to add comment!', 'Close', { duration: 2000 })
      alert('Failed to add comment!')
    });
  }

  updateTicketStatus(status: string, id: number) {
    console.log('Updating ticket status:', status, 'for ticket ID:', id);
    if (!this.role || (this.role !== 'ADMIN' && this.role !== 'CSR')) {
      //this.snackBar.open('You do not have permission to update ticket status!', 'Close', { duration: 2000 });
      alert('You do not have permission to update ticket status!');
      return;
    }
    confirm('Are you sure you want to update the ticket status to ' + status + '?') || (status = this.ticket.status);
    this.ticketService.update(id, status, this.userEmail).subscribe({
      next: () => {
        //this.snackBar.open('Ticket status updated!', 'Close', { duration: 2000 });
        alert('Ticket status updated!');
        this.loadTicket();
      },
      error: () => //this.snackBar.open('Failed to update ticket status!', 'Close', { duration: 2000 })
      alert('Failed to update ticket status!')
    });
  }
}

