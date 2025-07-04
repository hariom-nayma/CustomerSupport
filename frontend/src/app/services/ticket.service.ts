import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = 'http://localhost:8080/api/ticket';

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get(`${this.apiUrl}`);
  }

  getByUser(){
    return this.http.get(`${this.apiUrl}/user`);
  }

  create(ticket: any) {
    return this.http.post(`${this.apiUrl}`,ticket);
  }

  getById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  update(id: number, status: string, assignee?: string){
    let url = `${this.apiUrl}/${id}?status=${status}`;
    if(assignee) {
      url += `&assignee=${assignee}`;
    }
    return this.http.put(url, null);
  }
}
