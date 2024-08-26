import fs from 'node:fs/promises';
import __dirname from '../../__dirname';
import path from 'path';

export async function getByKey(key: String) {
    const dataDir = path.join(__dirname, 'data');
    const content = await fs.readFile(path.join(dataDir, key + '.json'));
    const json = JSON.parse(content);
    json.key = key;
    return json;
}

export async function getKeys() {
    const dataDir = path.join(__dirname, 'data');
    const communityFiles = await fs.readdir(dataDir);
    return communityFiles
        .filter(f => f.endsWith('.json') && f != 'conferences.json')
        .map((f) => f.substring(0, f.length - '.json'.length))
        ;
}

export async function getList() {
    const keys = await getKeys();
    return await Promise.all(keys
        .map(async (key) => {
            return await getByKey(key);
        })
    );
}
