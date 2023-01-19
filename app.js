import http from 'http';
import { read_file, write_file } from './fsRead.js';

const port = 3333;
const options = { "Content-Type": "application/json" };
const server = http.createServer((req, res) => {
    const categories = read_file('categories.json');
    const subCategories = read_file('subCategories.json');
    const products = read_file('products.json');

    if (req.method === 'GET') {
        if (req.url === '/categories') {
            categories.forEach(category => {
                let addSub = []
                subCategories.forEach(subcategory => {
                    if (category.category_id == subcategory.category_id) {
                        addSub.push(subcategory);
                    }
                })
                category.subCategories = addSub;
            })
            res.writeHead(200, options);
            res.end(JSON.stringify(categories));
        }
    }
});

server.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on port ${port}`);
})