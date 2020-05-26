#!/bin/sh

# --batch to prevent interactive command
gpg --quiet --batch --yes --decrypt --passphrase="$PASSPHRASE" \
--output environment.prod.ts environment.prod.encrypted.ts.gpg
