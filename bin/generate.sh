#!/bin/sh

# Source the spinner function
source "$(pwd)/bin/spinner.sh"

# Parse options with aliases
while getopts ":n:a:-:" opt; do
  case "$opt" in
    n | name) MODULE="$OPTARG" ;;
    a | attributes) ATTRIBUTES="$OPTARG" ;;
    -)
      case "${OPTARG}" in
        name=*) MODULE="${OPTARG#*=}" ;;
        attributes=*) ATTRIBUTES="${OPTARG#*=}" ;;
        *)
          echo "Invalid option: --${OPTARG}" >&2
          exit 1
          ;;
      esac
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

# If no module is specified, exit with an error
if [ -z "$MODULE" ]; then
  echo -e "\033[0;31m[ERROR]: No module specified.\033[0m"
  # Display the help message
  echo "Usage: generate [options]"
  echo ""
  echo "Options:"
  echo "  -n, --name <name>                module name"
  echo "  -a, --attributes <attributes>    module attributes"
  echo ""
  echo "Examples:"
  echo "  $ generate -n User -a name:string,age:number"
  echo "  $ generate --name User --attributes name:string,age:number"
  exit 1
fi

# If no attributes are specified, set a warning and continue
if [ -z "$ATTRIBUTES" ]; then
  echo -e "\033[0;33m[WARNING]: No attributes specified.\033[0m"
fi

# If the module name is not in lower snake case, exit with an error
if [ "$MODULE" != "$(echo "$MODULE" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')" ]; then
  echo -e "\033[0;31m[ERROR]: Module name must be in lower snake case.\033[0m"
  exit 1
fi

# Prepare the module name
MODULE_LOWER_SNAKE_CASE=$(echo "$MODULE" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')
MODULE_UPPER_SNAKE_CASE=$(echo "$MODULE_LOWER_SNAKE_CASE" | tr '[:lower:]' '[:upper:]')
MODULE_CAMEL_CASE=$(echo "$MODULE_LOWER_SNAKE_CASE" | awk -F_ '{for(i=1;i<=NF;i++) printf "%s%s", toupper(substr($i,1,1)), tolower(substr($i,2));}')
MODULE_LOWER_CAMEL_CASE=$(echo "${MODULE_CAMEL_CASE:0:1}" | tr '[:upper:]' '[:lower:]')${MODULE_CAMEL_CASE:1}

# echo blue message of the above variables
echo -e "\033[1;36m[DEBUG]: Module name: $MODULE\033[0m"
echo -e "\033[1;36m[DEBUG]: Module lower snake case: $MODULE_LOWER_SNAKE_CASE\033[0m"
echo -e "\033[1;36m[DEBUG]: Module camel case: $MODULE_CAMEL_CASE\033[0m"
echo -e "\033[1;36m[DEBUG]: Module upper snake case: $MODULE_UPPER_SNAKE_CASE\033[0m"

# Start the progress animation
start_spinner '\r\033[0;33m[INFO]: Creating module... %s\033[0m'
sleep 5

# Save the PID of the progress animation process
PROGRESS_PID=$!

# If the folder for the module already exists, exit with an error
if [ -d "./src/modules/$MODULE_LOWER_SNAKE_CASE" ]; then
  printf "\n\033[0;31m[ERROR]: Module $MODULE already exists.\033[0m\t"
  # Kill the progress animation process
  kill "$PROGRESS_PID" > /dev/null 2>&1
  stop_spinner 1
  exit 1
fi

# Create the folder for the module
mkdir "./src/modules/$MODULE_LOWER_SNAKE_CASE"

# Set the path to the module, lowercase the module name
MODULE_PATH="./src/modules/$MODULE_LOWER_SNAKE_CASE/$MODULE_LOWER_SNAKE_CASE.module.ts"

# If the module already exists, exit with an error
if [ -f "$MODULE_PATH" ]; then
  printf "\n\033[0;31m[ERROR]: Module $MODULE already exists.\033[0m"
  # Kill the progress animation process
  kill "$PROGRESS_PID" > /dev/null 2>&1
  stop_spinner 1
  exit 1
fi

# Create the module file
touch $MODULE_PATH

# Write the module file
echo "import { Injector } from '@/core/classes/container/decorators/injector.decorator';
import { ${MODULE_CAMEL_CASE}Service } from './${MODULE_LOWER_SNAKE_CASE}.service';
import { ${MODULE_CAMEL_CASE}Controller } from './${MODULE_LOWER_SNAKE_CASE}.controller';

@Injector({
  dependencies: [${MODULE_CAMEL_CASE}Service],
  controllers: [${MODULE_CAMEL_CASE}Controller],
})

export class ${MODULE_CAMEL_CASE}Module {}" > $MODULE_PATH

# Set the path to the service
SERVICE_PATH="./src/modules/$MODULE_LOWER_SNAKE_CASE/${MODULE_LOWER_SNAKE_CASE}.service.ts"

# If the service already exists, exit with an error
if [ -f "$SERVICE_PATH" ]; then
  printf "\n\033[0;31m[ERROR]: Service $MODULE already exists.\033[0m"
  # Kill the progress animation process
  kill "$PROGRESS_PID" > /dev/null 2>&1
  stop_spinner 1
  exit 1
fi

# Create the service file
touch $SERVICE_PATH

# Write the service file
echo "import { Service } from 'typedi';
import { ${MODULE_CAMEL_CASE}Repository } from './${MODULE_LOWER_SNAKE_CASE}.repository';

@Service()
export class ${MODULE_CAMEL_CASE}Service {
  constructor(private readonly ${MODULE_LOWER_CAMEL_CASE}Repository: ${MODULE_CAMEL_CASE}Repository) {}
}" > $SERVICE_PATH

# Set the path to the repository
REPOSITORY_PATH="./src/modules/$MODULE_LOWER_SNAKE_CASE/${MODULE_LOWER_SNAKE_CASE}.repository.ts"

# If the repository already exists, exit with an error
if [ -f "$REPOSITORY_PATH" ]; then
  printf "\n\033[0;31m[ERROR]: Repository $MODULE already exists.\033[0m"
  # Kill the progress animation process
  kill "$PROGRESS_PID" > /dev/null 2>&1
  stop_spinner 1
  exit 1
fi

# Create the repository file
touch $REPOSITORY_PATH

# Write the repository file
echo "
import { Repository } from '@/core/classes/database/repository.class';
import { ManyArgs } from '@/core/classes/database/types';
import { Prisma, PrismaClient, ${MODULE_CAMEL_CASE} } from '@prisma/client';
import { Service } from 'typedi';

@Service()
export class ${MODULE_CAMEL_CASE}Repository extends Repository<${MODULE_CAMEL_CASE}> {
  constructor(protected readonly prisma: PrismaClient) {
    super(prisma, '${MODULE_LOWER_SNAKE_CASE}');
  }

  public async create(data: Prisma.${MODULE_CAMEL_CASE}UncheckedCreateInput): Promise<${MODULE_CAMEL_CASE}> {
    return this.prisma.${MODULE_LOWER_CAMEL_CASE}.create({ data });
  }

  public async update(
    where: Prisma.${MODULE_CAMEL_CASE}WhereUniqueInput,
    data: Prisma.${MODULE_CAMEL_CASE}UpdateInput,
  ): Promise<${MODULE_CAMEL_CASE}> {
    return this.prisma.${MODULE_LOWER_CAMEL_CASE}.update({ where, data });
  }

  public async delete(query: { id: any }): Promise<${MODULE_CAMEL_CASE}> {
    return this.prisma.${MODULE_LOWER_CAMEL_CASE}.delete({ where: query });
  }

  public async findMany(args?: ManyArgs<${MODULE_CAMEL_CASE}>): Promise<${MODULE_CAMEL_CASE}[]> {
    return this.prisma.${MODULE_LOWER_CAMEL_CASE}.findMany(args);
  }

  public async findUnique(query: { id: any }): Promise<${MODULE_CAMEL_CASE} | null> {
    return this.prisma.${MODULE_LOWER_CAMEL_CASE}.findUnique({
      where: query,
    });
  }

  public async findUniqueOrThrow(query: { id: any }): Promise<${MODULE_CAMEL_CASE}> {
    return this.prisma.${MODULE_LOWER_CAMEL_CASE}.findUniqueOrThrow({
      where: query,
    });
  }
}
" > $REPOSITORY_PATH

# Set the path to the controller
CONTROLLER_PATH="./src/modules/$MODULE_LOWER_SNAKE_CASE/${MODULE_LOWER_SNAKE_CASE}.controller.ts"

# If the controller already exists, exit with an error
if [ -f "$CONTROLLER_PATH" ]; then
  printf "\n\033[0;31m[ERROR]: Controller $MODULE already exists.\033[0m"
  # Kill the progress animation process
  kill "$PROGRESS_PID" > /dev/null 2>&1
  stop_spinner 1
  exit 1
fi

# Create the controller file
touch $CONTROLLER_PATH

# Write the controller file
echo "import { Controller } from '@/core/decorators/controller.decorator';
import { Get } from '@/core/decorators/routers';
import { ${MODULE_CAMEL_CASE}Service } from './${MODULE_LOWER_SNAKE_CASE}.service';
import { Service } from 'typedi';

@Service()
@Controller('/${MODULE_LOWER_SNAKE_CASE}')
export class ${MODULE_CAMEL_CASE}Controller {
  constructor(private readonly ${MODULE_LOWER_CAMEL_CASE}Service: ${MODULE_CAMEL_CASE}Service) {}

  @Get('/')
  public async get() {
    return 'Hello World!';
  }
}" > $CONTROLLER_PATH

# Set the path to the test file
TEST_PATH="./src/modules/$MODULE_LOWER_SNAKE_CASE/${MODULE_LOWER_SNAKE_CASE}.spec.ts"

# If the test already exists, exit with an error
if [ -f "$TEST_PATH" ]; then
  printf "\n\033[0;31m[ERROR]: Test $MODULE already exists.\033[0m"
  # Kill the progress animation process
  kill "$PROGRESS_PID" > /dev/null 2>&1
  stop_spinner 1
  exit 1
fi

# Create the test file
touch $TEST_PATH

# Write the test file
echo "import { ${MODULE_CAMEL_CASE}Service } from './${MODULE_LOWER_SNAKE_CASE}.service';

describe('${MODULE_CAMEL_CASE}Service', () => {
  let service: ${MODULE_CAMEL_CASE}Service;

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});" > $TEST_PATH

# Set the path to the schema file
SCHEMA_PATH="./src/modules/$MODULE_LOWER_SNAKE_CASE/${MODULE_LOWER_SNAKE_CASE}.schema.ts"

# If the schema already exists, exit with an error
if [ -f "$SCHEMA_PATH" ]; then
  printf "\n\033[0;31m[ERROR]: Schema $MODULE already exists.\033[0m"
  # Kill the progress animation process
  kill "$PROGRESS_PID" > /dev/null 2>&1
  stop_spinner 1
  exit 1
fi

# Create the schema file
touch $SCHEMA_PATH

# Write the schema file
echo "import z from '@/openapi/default';

export const ${MODULE_CAMEL_CASE}Schema = z.object({});" > $SCHEMA_PATH

# If the process is still running, stop it
if [ -n "$(ps -p $PROGRESS_PID -o pid=)" ]; then
  # Kill the progress animation process
  kill "$PROGRESS_PID" > /dev/null 2>&1
  stop_spinner 0
fi

# Set the path to the factory file
FACTORY_PATH="./src/modules/$MODULE_LOWER_SNAKE_CASE/${MODULE_LOWER_SNAKE_CASE}.factory.ts"

# If the factory already exists, exit with an error
if [ -f "$FACTORY_PATH" ]; then
  printf "\n\033[0;31m[ERROR]: Factory $MODULE already exists.\033[0m"
  # Kill the progress animation process
  kill "$PROGRESS_PID" > /dev/null 2>&1
  stop_spinner 1
  exit 1
fi

# Create the factory file
touch $FACTORY_PATH

# Write the factory file
echo "import { Factory } from '@/core/classes/database/factory.class';
import { LogLevelsEnum } from '@/core/classes/logger/logger.types';
import { logger } from '@/utils/logger';
import { ${MODULE_CAMEL_CASE} } from '@prisma/client';
import { ${MODULE_CAMEL_CASE}Schema } from './${MODULE_LOWER_SNAKE_CASE}.schema';

export class ${MODULE_CAMEL_CASE}Factory extends Factory<${MODULE_CAMEL_CASE}> {
  protected readonly schema = ${MODULE_CAMEL_CASE}Schema;

  protected async attributes(): Promise<Partial<${MODULE_CAMEL_CASE}>> {
    return {};
  }

  public async beforeCreate(data: Partial<${MODULE_CAMEL_CASE}>): Promise<void> {
    logger(LogLevelsEnum.INFO, 'Creating ${MODULE_LOWER_SNAKE_CASE}...', { data });
  }

  public async afterCreate(created: ${MODULE_CAMEL_CASE}): Promise<void> {
    logger(LogLevelsEnum.INFO, 'Created ${MODULE_LOWER_SNAKE_CASE}!', { created });
  }
}" > $FACTORY_PATH