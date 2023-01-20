import http from 'http';
import { read_file, write_file } from './fsRead.js';
import url from 'url';

const port = 3333;
const options = { "Content-Type": "application/json" };
const server = http.createServer((req, res) => {
    const categories = read_file('categories.json');
    const subcategories = read_file('subcategories.json');
    const products = read_file('products.json');

    if (req.method === 'GET') {
        let id = req.url.split('/')[2];
        res.writeHead(200, options);
        categories.forEach(category => {
            let addSub = []
            subcategories.forEach(subcategory => {
                if (category.categoryId == subcategory.categoryId) {
                    addSub.push(subcategory);
                }
            })
            category.subcategories = addSub;
        });
        if (req.url === '/categories') {
            return res.end(JSON.stringify(categories));
        };
        if (req.url === `/categories/${id}`) {
            return res.end(JSON.stringify(categories.find(c => c.categoryId == id)));
        };

        subcategories.forEach(sub => {
            let addPro = [];
            products.forEach(pro => {
                if (sub.subCategoryId == pro.subCategoryId) {
                    addPro.push(pro);
                }
            })
            sub.products = addPro;
        })
        if (req.url === '/subcategories') {
            return res.end(JSON.stringify(subcategories));
        };
        if (req.url === `/subcategories/${id}`) {
            return res.end(JSON.stringify(subcategories.find(s => s.subCategoryId == id)));
        };

        if (req.url === '/products') {
            return res.end(JSON.stringify(products));
        }

        if (req.url === `/products/${id}`) {
            return res.end(JSON.stringify(products.find(p => p.productId == id)));
        }
    };
});

server.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on port ${port}`);
})