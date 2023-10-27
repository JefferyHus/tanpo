import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// extend the zod schema with the openapi schema
extendZodWithOpenApi(z);

// export the zod schema as the default export
export default z;
