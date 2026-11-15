#!/usr/bin/env node

/**
 * Neon CA Certificate to Vercel Environment Variable Converter
 *
 * Usage:
 *   node scripts/convert_ca_to_string.js [path/to/ca.pem] [--write-env]
 *
 * Purpose:
 *   Reads a Neon SSL CA certificate (ca.pem) and converts it into a clean,
 *   escaped string format ready to be set in Vercel Environment Variables
 *   as CA_STRING (bypassing Vercel's limitation on reading runtime filesystem certs).
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.info('Usage: node scripts/convert_ca_to_string.js [path/to/ca.pem] [--write-env]');
  console.info('Converts a Neon CA PEM certificate into a Vercel-ready CA_STRING.');
  process.exit(0);
}
const writeToEnv = args.includes('--write-env');
const targetFile = args.find((arg) => !arg.startsWith('--')) || 'ca.pem';

const resolvedPath = path.resolve(process.cwd(), targetFile);

console.info('===========================================================');
console.info('  Neon CA Certificate -> Vercel Environment String Utility');
console.info('===========================================================\n');

if (!fs.existsSync(resolvedPath)) {
  console.error(`❌ File not found at: ${resolvedPath}\n`);
  console.info('💡 How to get your Neon CA certificate:');
  console.info('   1. Neon uses Let\'s Encrypt / ISRG Root X1 certificates.');
  console.info('   2. Download the root certificate:');
  console.info('      curl -s -o ca.pem https://letsencrypt.org/certs/isrgrootx1.pem');
  console.info('   3. Or export the certificate provided in your Neon console.');
  console.info('   4. Re-run: node scripts/convert_ca_to_string.js ca.pem\n');
  process.exit(1);
}

try {
  const pemRaw = fs.readFileSync(resolvedPath, 'utf-8').trim();

  if (!pemRaw.includes('BEGIN CERTIFICATE')) {
    console.error('⚠️ Warning: The provided file does not appear to contain a valid PEM certificate ("BEGIN CERTIFICATE" not found).');
  }

  // Format 1: Escaped single-line string with literal \n (for .env or vercel env add)
  const escapedSingleLine = pemRaw.replace(/\r\n/g, '\n').replace(/\n/g, '\\n');

  console.info(`✅ Successfully loaded certificate from: ${targetFile} (${pemRaw.length} bytes)\n`);

  console.info('--- [Option A] Direct Raw String (for Vercel Dashboard Web UI) ---');
  console.info('Paste this exact value into Vercel Dashboard -> Settings -> Environment Variables -> Key: CA_STRING:\n');
  console.info(pemRaw);
  console.info('\n------------------------------------------------------------------\n');

  console.info('--- [Option B] Single-Line Escaped String (for .env or CI/CD) ---');
  console.info(`CA_STRING="${escapedSingleLine}"\n`);
  console.info('------------------------------------------------------------------\n');

  if (writeToEnv) {
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';

    if (envContent.includes('CA_STRING=')) {
      envContent = envContent.replace(/CA_STRING=.*/g, `CA_STRING="${escapedSingleLine}"`);
      console.info('📝 Updated existing CA_STRING in .env');
    } else {
      envContent += `\n# Neon Database SSL CA Certificate for Vercel\nCA_STRING="${escapedSingleLine}"\n`;
      console.info('📝 Appended CA_STRING to .env');
    }

    fs.writeFileSync(envPath, envContent, 'utf-8');
    console.info('✅ .env file successfully updated!\n');
  } else {
    console.info('💡 Tip: Pass --write-env to automatically update your local .env file:');
    console.info(`   node scripts/convert_ca_to_string.js ${targetFile} --write-env\n`);
  }
} catch (error) {
  console.error('❌ Failed to process certificate file:', error.message);
  process.exit(1);
}
