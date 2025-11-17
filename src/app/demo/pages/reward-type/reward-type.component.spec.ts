import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardType } from './reward-type.component';

describe('RewardType', () => {
  let component: RewardType;
  let fixture: ComponentFixture<RewardType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewardType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
