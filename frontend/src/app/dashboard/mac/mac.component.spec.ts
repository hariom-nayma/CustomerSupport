import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacComponent } from './mac.component';

describe('MacComponent', () => {
  let component: MacComponent;
  let fixture: ComponentFixture<MacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MacComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
