#!/bin/sh

# Check if gnupg is installed
if ! command -v gpg &> /dev/null
then
    echo "gpg could not be found. Installing..."
    brew install gnupg
fi

# Check if doppler is installed
if ! command -v doppler &> /dev/null
then
    echo "doppler could not be found. Installing..."
    brew install dopplerhq/cli/doppler
fi

# Check if doppler is logged in
if ! doppler whoami &> /dev/null
then
    echo "doppler is not logged in. Logging in..."
    doppler login
fi

# Check if doppler is configured
if ! doppler setup --check &> /dev/null
then
    echo "doppler is not configured. Configuring..."
    doppler setup
fi

# Pull secrets and save them to a file .env
doppler secrets download --no-file --format env > .env