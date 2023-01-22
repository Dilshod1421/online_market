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

    try {
        //======================= GET =========================================
        if (req.method === 'GET') {
            categories.forEach(c => {
                let addSub = []
                subcategories.forEach(s => {
                    if (c.categoryId == s.categoryId) {
                        delete s.categoryId
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
            });

            if (req.url === '/subcategories') {
                return res.end(JSON.stringify(subcategories));
            };

            if (req.url === `/subcategories/${id}`) {
                return res.end(JSON.stringify(subcategories.find(s => s.subCategoryId == id)));
            };

            if (req.url === '/products') {
                return res.end(JSON.stringify());
            };

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


        //======================= POST =========================================
        if (req.method == 'POST') {
            if (req.url === '/categories') {
                req.on('data', data => {
                    categories.push({ categoryId: categories[categories.length - 1].categoryId + 1, ...JSON.parse(data) });
                    write_file('categories.json', categories);
                    return res.end(JSON.stringify(categories));
                })
            };

            if (req.url === '/subcategories') {
                req.on('data', data => {
                    subcategories.push({ subCategoryId: subcategories[subcategories.length - 1].subCategoryId + 1, ...JSON.parse(data) });
                    write_file('subcategories.json', subcategories);
                    return res.end(JSON.stringify(subcategories));
                })
            };

            if (req.url === '/products') {
                req.on('data', data => {
                    products.push({ productId: products[products.length - 1].productId + 1, ...JSON.parse(data) });
                    write_file('products.json', products);
                    return res.end(JSON.stringify(products));
                })
            };
        };


        //======================= PUT =========================================
        if (req.method === 'PUT') {
            if (req.url === `/categories/${id}`) {
                req.on('data', data => {
                    let info = JSON.parse(data);
                    categories.forEach(c => {
                        if (c.categoryId == id) {
                            c.categoryName = info.categoryName || c.categoryName;
                        }
                    });
                    write_file('categories.json', categories);
                    return res.end(JSON.stringify(categories));
                });
            };

            if (req.url === `/subcategories/${id}`) {
                req.on('data', data => {
                    let info = JSON.parse(data);
                    subcategories.forEach(s => {
                        if (s.subCategoryId == id) {
                            s.categoryId = info.categoryId || s.categoryId,
                                s.subCategoryName = info.subCategoryName || s.subCategoryName;
                        }
                    });
                    write_file('subcategories.json', subcategories);
                    return res.end(JSON.stringify(subcategories));
                });
            };

            if (req.url === `/products/${id}`) {
                req.on('data', data => {
                    let info = JSON.parse(data);
                    products.forEach(p => {
                        if (p.productId == id) {
                            p.subCategoryId = info.subCategoryId || p.subCategoryId,
                                p.model = info.model || p.model,
                                p.productName = info.productName || p.productName,
                                p.color = info.color || p.color,
                                p.price = info.price || p.price;
                        }
                    });
                    write_file('products.json', products);
                    return res.end(JSON.stringify(products));
                });
            };
        };


        //======================= DELETE =========================================
        if (req.method == 'DELETE') {
            if (req.url === `/categories/${id}`) {
                categories.forEach((c, i) => {
                    if (c.categoryId == id) {
                        categories.splice(i, 1);
                    }
                })
                write_file('categories.json', categories);
                return res.end(JSON.stringify(categories));
            };

            if (req.url === `/subcategories/${id}`) {
                subcategories.forEach((s, i) => {
                    if (s.subCategoryId == id) {
                        subcategories.splice(i, 1);
                    }
                })
                write_file('subcategories.json', subcategories);
                return res.end(JSON.stringify(subcategories));
            };

            if (req.url === `/products/${id}`) {
                products.forEach((p, i) => {
                    if (p.productId == id) {
                        products.splice(i, 1);
                    }
                })
                write_file('products.json', products);
                return res.end(JSON.stringify(products));
            };
        };
    } catch {
        res.end(JSON.stringify('DANG!!!'));
    };
});

server.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on port ${port}`);
})