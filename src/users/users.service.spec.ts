import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User, UserSchema } from './entities/user.entity';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../common/helper/mongoose.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../common/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';

import * as Chance from 'chance';
import { Role } from '../roles/enums/role.enum';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

const chance = new Chance();

let userId = ''; //this will be reused across our tests
const createUserInput: CreateUserInput = {
  firstName: chance.first(),
  lastName: chance.last(),
  email: chance.email(),
  password: chance.first(),
  role: Role.ADMIN,
};

const updateUserInput: UpdateUserInput = {
  _id: userId,
  lastName: chance.last(),
  firstName: chance.first(),
};

describe('UsersService', () => {
  let service: UsersService;
  let authService: AuthService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
      ],
      providers: [UsersService, AuthService, JwtService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  it('UserService should be defined', () => {
    expect(service).toBeDefined();
    // expect(authService).toBeDefined();
  });

  it('AuthService should be defined', () => {
    // expect(service).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('should create an user with createUserInput', async () => {
    // console.log(createUserInput);
    // console.log(service);
    const user = await service.create(createUserInput);
    expect(user).toBeDefined();
    // console.log(user);
    expect(user.id).toBeDefined();
    expect(user.firstName).toBe(createUserInput.firstName);
    expect(user.lastName).toBe(createUserInput.lastName);
    expect(user.email).toBe(createUserInput.email);
    expect(user.role).toBe(createUserInput.role);
    userId = user.id;
  });

  it('should get a list of users', async () => {
    const users = await service.findAll();
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(1);
    expect(users[0].firstName).toBe(createUserInput.firstName);
    expect(users[0].lastName).toBe(createUserInput.lastName);
    expect(users[0].email).toBe(createUserInput.email);
    expect(users[0].role).toBe(createUserInput.role);
  });

  it('should get the user by its own userId', async () => {
    const user = await service.findOne(userId);
    expect(user._id.toString()).toBe(userId);
    expect(user.firstName).toBe(createUserInput.firstName);
    expect(user.lastName).toBe(createUserInput.lastName);
    expect(user.email).toBe(createUserInput.email);
    expect(user.role).toBe(createUserInput.role);
  });

  it('should update some user properties', async () => {
    updateUserInput._id = userId;
    const updatedUser = await service.update(
      updateUserInput._id,
      updateUserInput,
    );
    expect(updatedUser._id.toString()).toBe(userId);
    expect(updatedUser.firstName).toBe(updateUserInput.firstName);
    expect(updatedUser.firstName).not.toBe(createUserInput.firstName);
    expect(updatedUser.lastName).toBe(updateUserInput.lastName);
    expect(updatedUser.lastName).not.toBe(createUserInput.lastName);
  });

  it('should delete the testing user', async () => {
    const deletedUser = await service.remove(userId);
    expect(deletedUser).toBeDefined();
  });

  it('should receive not found error for getting the deleted user', async () => {
    try {
      await service.findOne(userId);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response).toBeDefined();
      expect(err.response.statusCode).toBe(404);
    }
  });
});
