import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSetupPage } from './match-setup.page';

describe('MatchSetupPage', () => {
  let component: MatchSetupPage;
  let fixture: ComponentFixture<MatchSetupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchSetupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchSetupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
