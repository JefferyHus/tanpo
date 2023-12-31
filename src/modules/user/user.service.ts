import { Service } from 'typedi';

import { UserRepository } from './user.repository';

@Service()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
}
