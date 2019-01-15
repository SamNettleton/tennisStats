import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackMatchPage } from './track-match.page';

describe('TrackMatchPage', () => {
  let component: TrackMatchPage;
  let fixture: ComponentFixture<TrackMatchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackMatchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackMatchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
