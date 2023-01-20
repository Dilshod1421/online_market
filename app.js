import http from 'http';
import { read_file, write_file } from './fsRead.js';
import url from 'url';

const port = 3333;
const options = { "Content-Type": "application/json" };
const server = http.createServer((req, res) => {
    const categories = read_file('categories.json');
    const subcategories = read_file('subcategories.json');
    const products = read_file('products.json');
    let id = req.url.split('/')[2];
    res.writeHead(200, options);

    if (req.method === 'GET') {
        categories.forEach(c => {
            let addSub = []
            subcategories.forEach(s => {
                if (c.categoryId == s.categoryId) {
                    addSub.push(s);
                }
            })
            c.subcategories = addSub;
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
            return res.end(JSON.stringify([]));
        }
        if (req.url === `/products/${id}`) {
            return res.end(JSON.stringify(products.find(p => p.productId == id)));
        };

        let catId = url.parse(req.url).search.at(-1);
        if (req.url === `/products?categoryId=${catId}`) {
            return res.end(JSON.stringify(categories.find(c => c.categoryId == catId)));
        };

        if (req.url === url.parse(req.url).href) {
            let div = url.parse(req.url).query.split('&');
            let search = [];
            div.forEach(s => search.push(s.split('=')));
            if (search.length == 2) {
                products.forEach(p => {
                    if (p[`${search[0][0]}`] == search[0][1] && p[`${search[1][0]}`] == search[1][1]) {
                        return res.end(JSON.stringify(p));
                    }
                })
            }
            else if (search.length == 1) {
                let que1 = [];
                products.forEach(p => {
                    if (p[`${search[0][0]}`] == search[0][1]) {
                        que1.push(p);
                    }
                })
                return res.end(JSON.stringify(que1));
            }
        };
    };

    if (req.method == 'POST') {}
});

server.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on port ${port}`);
})