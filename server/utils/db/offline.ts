import { writeFile, readFile } from "fs/promises";
import path from "path";

interface DBData {
    users: any[]
}

const DB_PATH = path.resolve('utils', 'db', 'db.json'); 
console.log("DB Path", DB_PATH);

const db = {
    set: async (key: string, value: any) => {
        try {
            const rawData: string = await readFile(DB_PATH, { encoding: 'utf8' });
            // TO-DO: handle case where db file does not exist
            console.log("DATA", rawData);

            const data: DBData = JSON.parse(rawData);
            if (key === 'users') {
                data[key] = value;
                await writeFile(DB_PATH, JSON.stringify(data));
            } else {
                console.error('Invalid key value:', key);
            }


        } catch (err) {
            console.error(err);
        }
    },
    get: async (key: string): Promise<any | undefined> => {
        try {
            const rawData: string = await readFile(DB_PATH, { encoding: 'utf8' });
            // TO-DO: handle case where db file does not exist
            console.log("DATA", rawData);

            const data: DBData = JSON.parse(rawData);

            if (key === 'users') {
                return data[key];
            } else {
                console.error('Invalid key', key);
            }

        } catch (err) {
            console.error(err);
        }
    }
}

export default db;