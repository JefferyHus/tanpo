import { Service } from 'typedi';

import { RoleRepository } from './role.repository';

@Service()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}
}
