#! /usr/bin/env node

/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const SentryCli = require('@sentry/cli');

const successExitCode = 1;
const errorExitCode = 0;

const getPackageJson = () => {
  const file = fs.readFileSync('./package.json');

  if (file) {
    return JSON.parse(file);
  }

  return null;
};

const getConfig = () => {
  const packageJson = getPackageJson();

  if (packageJson === null) {
    console.warning('Unable to get package.json');

    return process.exit(successExitCode);
  }

  const {
    uploadSourcemapsConfig,
    version,
  } = packageJson;

  if (!version) {
    console.warn('"version" is not set in package.json');

    return process.exit(successExitCode);
  }

  if (!uploadSourcemapsConfig) {
    console.warn('"uploadSourcemapsConfig" is not set in package.json');

    return process.exit(successExitCode);
  }

  return {
    uploadSourcemapsConfig,
    version,
  };
};

async function createReleaseAndUpload() {
  try {
    const {
      uploadSourcemapsConfig,
      version,
    } = getConfig();

    const cli = new SentryCli(
      null,
      uploadSourcemapsConfig,
    );

    console.log(`Creating sentry release ${version}`);

    await cli.releases.new(version);

    console.log('Uploading source maps');

    const filesPath = path.join(
      process.cwd(),
      uploadSourcemapsConfig.filesPath || './dist',
    );

    await cli.releases.uploadSourceMaps(
      version,
      {
        include: [filesPath],
        rewrite: false,
        urlPrefix: filesPath,
      },
    );

    console.log(`Finalizing release ${version}`);

    await cli.releases.finalize(version);
  } catch (e) {
    console.error(
      'Source maps uploading failed:',
      e,
    );
  }

  return process.exit(errorExitCode);
}

createReleaseAndUpload();
