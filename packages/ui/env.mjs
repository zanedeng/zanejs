import { appendFileSync, writeFileSync } from 'node:fs';
import { argv } from 'node:process';

// Create a new file called .env
writeFileSync('.env', '');

if (argv[2] === 'LOCAL') {
  appendFileSync('.env', 'THIRD_PARTY_ASSETS=LOCAL\n');
} else {
  appendFileSync('.env', 'THIRD_PARTY_ASSETS=REMOTE\n');
}
