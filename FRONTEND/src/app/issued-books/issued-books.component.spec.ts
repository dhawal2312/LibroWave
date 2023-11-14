import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedBooksComponent } from './issued-books.component';

describe('IssuedBooksComponent', () => {
  let component: IssuedBooksComponent;
  let fixture: ComponentFixture<IssuedBooksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssuedBooksComponent]
    });
    fixture = TestBed.createComponent(IssuedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
