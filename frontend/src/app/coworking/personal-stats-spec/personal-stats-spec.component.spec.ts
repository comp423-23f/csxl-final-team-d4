import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalStatsSpecComponent } from './personal-stats-spec.component';

describe('PersonalStatsSpecComponent', () => {
  let component: PersonalStatsSpecComponent;
  let fixture: ComponentFixture<PersonalStatsSpecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalStatsSpecComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalStatsSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
