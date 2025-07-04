import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'token';
  public currentRole = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    this.loadRole(); 
  }

  login(log: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, log);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  getUsers(){
    return this.http.get(`${this.apiUrl}/all`);
  }

  getCurrentUser() {
    return this.http.get(`${this.apiUrl}/me`);  
  }

verifyOtp(payload: any) {
  return this.http.post('http://localhost:8080/api/auth/verify-otp', payload);
}

sendOtp(email: string): Observable<any> {
   return this.http.post('http://localhost:8080/api/auth/forgot-password?email=' + email, {});
}

resetPassword(payload: any): Observable<any> {
  return this.http.post('http://localhost:8080/api/auth/reset-password', payload);
}

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.loadRole();  
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentRole.next(null);
  }

  getUserRole() {
    return this.currentRole.getValue();  
  }

  getUserEmail() {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.sub || null; 
    }
    return null;
  }

 private loadRole() {
  const token = this.getToken();

  if (token) {
    try {
      if (!token.includes('.')) {
        console.warn('Invalid token format');
        this.currentRole.next(null);
        return;
      }

      const decoded: any = jwtDecode(token);
      const authorities = decoded.authorities || [];
      const role = authorities[0]?.replace('ROLE_', '') || null;
      this.currentRole.next(role);

    } catch (error) {
      console.error('Error decoding token:', error);
      this.currentRole.next(null);
    }
  } else {
    this.currentRole.next(null);
  }
}


  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded: any = jwtDecode(token);
    const exp = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);

    return exp > currentTime;
  }


}