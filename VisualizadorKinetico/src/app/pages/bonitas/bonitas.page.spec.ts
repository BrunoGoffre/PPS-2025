import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BonitasPage } from './bonitas.page';

describe('BonitasPage', () => {
  let component: BonitasPage;
  let fixture: ComponentFixture<BonitasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BonitasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
