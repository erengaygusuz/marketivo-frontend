import { TestBed } from '@angular/core/testing';

import { Lu2ShopForm } from './lu2-shop-form';

describe('Lu2ShopForm', () => {
  let service: Lu2ShopForm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Lu2ShopForm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
