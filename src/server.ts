import 'dotenv/config';
import 'module-alias/register';
import 'reflect-metadata';
import { bootstrap } from './bootstrap';
import { database } from './core/classes/database/client';

bootstrap(database());
