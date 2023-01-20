import fs from 'fs';

const read_file = (filename) => {
    return JSON.parse(fs.readFileSync(`./database/${filename}`, 'utf-8'));
};

const write_file = (filename, data) => {
    return fs.writeFileSync(`./database/${filename}`, JSON.stringify(data, null, 2));
};

export {
    read_file, write_file
};