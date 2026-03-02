import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteEvidenza } from './visite-evidenza';

describe('VisiteEvidenza', () => {
  let component: VisiteEvidenza;
  let fixture: ComponentFixture<VisiteEvidenza>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisiteEvidenza]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisiteEvidenza);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
