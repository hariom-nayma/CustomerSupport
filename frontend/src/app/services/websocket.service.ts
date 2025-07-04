import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private stompClient!: Client;

  // Subjects for different topics
  private ticketUpdatesSubject = new Subject<string>();
  private commentUpdatesSubject = new Subject<string>();
  private notificationSubject = new Subject<string>();

  // Expose as Observables
  ticketUpdates$ = this.ticketUpdatesSubject.asObservable();
  commentUpdates$ = this.commentUpdatesSubject.asObservable();
  notifications$ = this.notificationSubject.asObservable();

  connect() {
    const socket = new SockJS('http://localhost:8080/ws');

    this.stompClient = new Client({
      webSocketFactory: () => socket as WebSocket,
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {
      console.log("✅ WebSocket connected!");

      // Ticket updates
      this.stompClient.subscribe('/topic/tickets', (message: IMessage) => {
        this.ticketUpdatesSubject.next(message.body);
      });

      // Comment updates
      this.stompClient.subscribe('/topic/ticket-updates/', (message: IMessage) => {
        this.commentUpdatesSubject.next(message.body);
      });

      // General notifications
      // this.stompClient.subscribe('/topic/notifications', (message: IMessage) => {
      //   this.notificationSubject.next(message.body);
      // });
    };

    this.stompClient.onStompError = (frame) => {
      console.error("❌ WebSocket error: ", frame);
    };

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
      console.log("WebSocket connection closed.");
    }
  }
}

