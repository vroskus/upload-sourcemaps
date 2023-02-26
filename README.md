# @vroskus/upload-sourcemaps

Tool for uploading project sourcemaps to Sentry.

## Installation

Call:

`npm install -D @vroskus/upload-sourcemaps`

`yarn add -D @vroskus/upload-sourcemaps`

## Usage

1. Ensure that you have added configuration to package.json. Example:

```json
// package.json
...
  "uploadSourcemapsConfig": {
    "org": "<Sentry Organization slug>",
    "project": "<Sentry Project slug>",
    "authToken": "<Sentry Authentication token for API>",
    "filesPath": "Path to sourcemap files (optional)"
  }
...
```

2. Call `upload-sourcemaps` after running build. Example:

```json
// package.json
...
  "scripts": {
    "upload:sourcemaps": "upload-sourcemaps",
  }
...
```
