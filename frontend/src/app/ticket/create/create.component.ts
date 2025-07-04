import { Component } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  ticket = { title: '', description: '', priority: 'LOW' };
  //priorities = ['LOW', 'MEDIUM', 'HIGH'];

  //ticketForm: FormGroup;
  constructor(private ticketService: TicketService, private router: Router) 
  {
    // this.ticketForm = this.fb.group({
    //   title: ['', Validators.required],
    //   description: ['', Validators.required],
    //   priority: ['LOW', Validators.required]
    // });
  }  

  onCreate(){
   // if (this.ticketForm.invalid) return;
    console.log(this.ticket);
    console.log('dsfgfg');

    this.ticketService.create(this.ticket).subscribe({
    
      next: () => {
        //this.snackBar.open('Ticket created successfully!', 'Close', { duration: 2000 });
        alert('Ticket created successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
       // this.snackBar.open('Failed to create ticket!', 'Close', { duration: 2000 });
       alert('Failed to create ticket!');
      }
    });

  }

}


