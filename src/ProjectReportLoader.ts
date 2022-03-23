import { ProjectReport } from './model/ProjectReport';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

export async function loadProjectReports(
  dir: string,
  reportPrefix: string,
): Promise<ProjectReport[]> {
  const dirListing = await fsPromises.readdir(dir, { withFileTypes: true });
  const reportFiles = dirListing
    .filter((entry) => entry.isFile() && entry.name.startsWith(reportPrefix))
    .map((entry) => entry.name);

  return await Promise.all(reportFiles.map((name) => loadReport(dir, name)));
}

async function loadReport(dir: string, name: string): Promise<ProjectReport> {
  const data = await fsPromises.readFile(path.join(dir, name));
  return JSON.parse(data.toString());
}
