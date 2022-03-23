import * as core from '@actions/core';
import * as artifact from '@actions/artifact';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as io from '@actions/io';

async function run() {
  const targetDir = await createTargetDir(core.getInput('target-dir'));
  const artifactPrefix = core.getInput('artifact-prefix');

  const artifacts = await fetchArtifacts(targetDir, artifactPrefix);

  console.log('found matching artifacts', artifacts);
}

async function fetchArtifacts(targetDir: string, prefix: string): Promise<string[]> {
  const artifactClient = artifact.create();

  const responses = await artifactClient.downloadAllArtifacts(targetDir);
  return responses
    .map((response) => response.artifactName)
    .filter((name) => name.startsWith(prefix));
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
