import { ProjectReport } from './model/ProjectReport';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

const REPORT_FILENAME = 'project-report.json';

export async function loadProjectReports(
  baseDir: string,
  artifactNames: string[],
): Promise<ProjectReport[]> {
  const reports: (ProjectReport | null)[] = await Promise.all(
    artifactNames.map((artifactName) => loadReport(baseDir, artifactName)),
  );

  return reports.filter((report) => report !== null);
}

async function loadReport(baseDir: string, artifactName: string): Promise<ProjectReport | null> {
  const reportPath = path.join(baseDir, artifactName, REPORT_FILENAME);
  const stat = await fsPromises.stat(reportPath);

  if (stat.isFile()) {
    const data = await fsPromises.readFile(reportPath);
    return JSON.parse(data.toString());
  } else {
    return null;
  }
}
