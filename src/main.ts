import * as core from '@actions/core';
import {getStatsForOrg} from './devto';

async function run(): Promise<void> {
  try {
    const orgName: string = core.getInput('orgName');
    const apiKey: string = core.getInput('apiKey');
    let results = await getStatsForOrg(orgName, apiKey);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
