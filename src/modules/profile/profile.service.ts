import { Service } from 'typedi';
import { ProfileRepository } from './profile.repository';

@Service()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}
}
