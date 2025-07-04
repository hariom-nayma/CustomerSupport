import { Component, OnInit, HostListener, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  imports: [CommonModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainComponent implements OnInit {
  isLoggedIn: boolean = false;
text = 'Hariom!';
randomClass() {
  return Math.random() > 0.5;
}

  constructor(private auth:AuthService){}

  ngOnInit() {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    document.body.appendChild(script);
    this.isLoggedIn= this.auth.isAuthenticated();
   console.log('is Login :'+this.isLoggedIn);
  }

 @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY;
    const modelBox = document.getElementById('modelBox');

    if (modelBox) {
      if (scrollY > 300) {
        modelBox.classList.add('move-right');
      } else {
        modelBox.classList.remove('move-right');
      }
    }
  }
}

