import fs from 'fs';

const read_file = (filename) => {
    return JSON.parse(fs.readFileSync(`./database/${filename}`, 'utf-8'));
};

const write_file = (filename) => {
    return JSON.parse(fs.writeFileSync(`./database/${filename}`, 'utf-8'));
};

export {
    read_file, write_file
};