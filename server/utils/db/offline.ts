import { writeFile, readFile } from "fs/promises";

interface DBData {
    users: any[]
}

const DB_PATH = 'utils\\db\\db.json'

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