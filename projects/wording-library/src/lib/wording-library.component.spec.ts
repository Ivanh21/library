import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordingLibraryComponent } from './wording-library.component';

describe('WordingLibraryComponent', () => {
  let component: WordingLibraryComponent;
  let fixture: ComponentFixture<WordingLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordingLibraryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordingLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
