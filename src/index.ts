import * as core from '@actions/core';
import * as artifact from '@actions/artifact';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as io from '@actions/io';

async function run() {
  const targetDir = await createTargetDir(core.getInput('target-dir'));
  await fetchArtifacts(targetDir);
}

async function fetchArtifacts(targetDir: string): Promise<string[]> {
  const artifactClient = artifact.create();

  const artifacts = await artifactClient.downloadAllArtifacts(targetDir);

  const names = artifacts.map((a) => a.artifactName);

  console.log('found artifacts?', names);

  return [];
}

async function createTargetDir(overrideDir: string): Promise<string> {
  if (overrideDir) {
    await io.mkdirP(overrideDir);
    return overrideDir;
  } else {
    return await fsPromises.mkdtemp(path.join(os.tmpdir(), 'fetch-test-results-'));
  }
}

run().catch((error) => {
  core.error('Unexpected error while processing JUnit results');
  core.debug(error);
  core.setFailed(error);
});
