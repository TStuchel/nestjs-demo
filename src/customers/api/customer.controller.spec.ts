import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from '../app/customer.service';
import { CustomerTranslator } from './customer.translator';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from '../model/customer.model';

describe('Customer Controller', () => {
  let controller: CustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot('mongodb://localhost:27017/customers'), MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }])],
      controllers: [CustomerController],
      providers: [CustomerService, CustomerTranslator]
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
