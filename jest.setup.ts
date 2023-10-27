import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config({ path: './src/tests/mocks/.env.mock' });

beforeEach(jest.restoreAllMocks);
afterEach(jest.clearAllMocks);
