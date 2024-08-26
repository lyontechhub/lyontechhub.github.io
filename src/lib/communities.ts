import fs from 'node:fs/promises';
import __dirname from '../../__dirname';
import path from 'path';

export async function getList() {
    const dataDir = path.join(__dirname, 'data');
    const communityFiles = await fs.readdir(dataDir);
    return await Promise.all(communityFiles
        .filter(f => f.endsWith('.json') && f != 'conferences.json')
        .map(async (f) => {
            const content = await fs.readFile(path.join(dataDir, f));
            const json = JSON.parse(content);
            json.key = f.substring(0, f.length - '.json'.length);
            return json;
        })
    );
}
