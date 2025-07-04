import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private baseUrl = 'http://localhost:8080/api/tickets';

  constructor(private http: HttpClient) {}

  addComment(ticketId: number, comment: any) {
    return this.http.post(`${this.baseUrl}/${ticketId}/comments`, comment);
  }

  getComments(ticketId: number) {
    return this.http.get(`${this.baseUrl}/${ticketId}/comments`);
  }
}

