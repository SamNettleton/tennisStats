import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorePopoverComponent } from './score-popover.component';

describe('ScorePopoverComponent', () => {
  let component: ScorePopoverComponent;
  let fixture: ComponentFixture<ScorePopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScorePopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorePopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
