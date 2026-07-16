"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const artifact = __importStar(require("@actions/artifact"));
const os = __importStar(require("os"));
const path_1 = require("path");
const constants_1 = require("./constants");
async function run() {
    try {
        const name = core.getInput(constants_1.Inputs.Name, { required: false });
        const path = core.getInput(constants_1.Inputs.Path, { required: false });
        let resolvedPath;
        // resolve tilde expansions, path.replace only replaces the first occurrence of a pattern
        if (path.startsWith(`~`)) {
            resolvedPath = path_1.resolve(path.replace('~', os.homedir()));
        }
        else {
            resolvedPath = path_1.resolve(path);
        }
        core.debug(`Resolved path is ${resolvedPath}`);
        const artifactClient = artifact.create();
        if (!name) {
            // download all artifacts
            core.info('No artifact name specified, downloading all artifacts');
            core.info('Creating an extra directory for each artifact that is being downloaded');
            const downloadResponse = await artifactClient.downloadAllArtifacts(resolvedPath);
            core.info(`There were ${downloadResponse.length} artifacts downloaded`);
            for (const artifact of downloadResponse) {
                core.info(`Artifact ${artifact.artifactName} was downloaded to ${artifact.downloadPath}`);
            }
        }
        else {
            // download a single artifact
            core.info(`Starting download for ${name}`);
            const downloadOptions = {
                createArtifactFolder: false
            };
            const downloadResponse = await artifactClient.downloadArtifact(name, resolvedPath, downloadOptions);
            core.info(`Artifact ${downloadResponse.artifactName} was downloaded to ${downloadResponse.downloadPath}`);
        }
        // output the directory that the artifact(s) was/were downloaded to
        // if no path is provided, an empty string resolves to the current working directory
        core.setOutput(constants_1.Outputs.DownloadPath, resolvedPath);
        core.info('Artifact download has finished successfully');
    }
    catch (err) {
        core.setFailed(err.message);
    }
}
run();
//# sourceMappingURL=download-artifact.js.map