import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioVisita } from './dettaglio-visita';

describe('DettaglioVisita', () => {
  let component: DettaglioVisita;
  let fixture: ComponentFixture<DettaglioVisita>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DettaglioVisita]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettaglioVisita);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
