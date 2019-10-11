import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPlayerComponent } from './search-player.component';

describe('SearchPlayerComponent', () => {
  let component: SearchPlayerComponent;
  let fixture: ComponentFixture<SearchPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
