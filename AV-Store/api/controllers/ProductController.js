const Product = require("../models/Product");
const Warehouse = require("../models/Warehouse");
const { formatResponse } = require("../utils/response");
require("dotenv").config();

class ProductController {
    // UPDATE
    update(req, res) {
        let { samples, deleteSamples, newSizes, images, ...product } = req.body;
        const id = req.params.id;
        let bulkSamples = [];
        let newSamples = [];

        if (deleteSamples.length > 0) {
            bulkSamples.push({
                deleteMany: {
                    filter: {
                        _id: { $in: deleteSamples },
                    },
                },
            });
        }

        if (newSizes.length > 0) {
            bulkSamples.push({
                updateMany: {
                    filter: { productId: id },
                    update: {
                        $push: {
                            quantity: {
                                $each: newSizes.map((size) => {
                                    return { [size]: 0 };
                                }),
                            },
                        },
                    },
                },
            });
        }

        if (samples.length > 0) {
            samples.forEach((sample) => {
                if (sample._id >= 0) {
                    const infoUpdate = {
                        updateOne: {
                            filter: { _id: sample._id },
                            update: sample.change,
                        },
                    };
                    if (sample.change.image >= 0) {
                        infoUpdate.updateOne.update.image = images[sample.change.image];
                    }

                    bulkSamples.push(infoUpdate);
                } else {
                    newSamples.push({
                        productId: id,
                        colorId: sample.change.colorId,
                        image: images[sample.change.image],
                        quantity: product.sizes.map((size) => {
                            return { [size]: 0 };
                        }),
                    });
                }
            });
        }

        Warehouse.bulkWrite(bulkSamples).catch(() =>
            res.json(formatResponse(4, "Ch???nh s???a th??ng tin s???n ph???m th???t b???i"))
        );
        Warehouse.create(newSamples).catch(() => res.json(formatResponse(4, "Ch???nh s???a th??ng tin s???n ph???m th???t b???i")));

        Product.findByIdAndUpdate({ _id: id }, product, { new: true })
            .then(() => res.json(formatResponse(0, "Ch???nh s???a th??ng tin s???n ph???m th??nh c??ng")))
            .catch(() => res.json(formatResponse(4, "Ch???nh s???a th??ng tin s???n ph???m th???t b???i")));
    }

    // DELETE
    delete(req, res) {
        Warehouse.delete({ productId: req.params.id }).catch(() => res.json(formatResponse(4, "X??a th???t b???i")));
        Product.delete({ _id: req.params.id })
            .then(() => res.json(formatResponse(0, "X??a s???n ph???m th??nh c??ng")))
            .catch(() => res.json(formatResponse(4, "X??a s???n ph???m th???t b???i")));
    }

    // CREATE
    create(req, res) {
        let { colors, images, ...info } = req.body;
        info.image = images[0];
        const product = new Product(info);
        const data = colors.map((color, index) => {
            return new Warehouse({
                productId: product._id,
                colorId: color,
                image: images[index],
                quantity: info.sizes.map((size) => {
                    return { [size]: 0 };
                }),
            });
        });

        product
            .save()
            .then(() => {
                Warehouse.bulkSave(data)
                    .then(() => res.json(formatResponse(0, "Th??m s???n ph???m th??nh c??ng")))
                    .catch(() => res.json(formatResponse(4, "Th??m s???n ph???m th???t b???i")));
            })
            .catch(() => res.json(formatResponse(4, "Th??m s???n ph???m th???t b???i")));
    }

    // GET ONE
    getProductById(req, res) {
        Product.findById(req.params.id)
            .populate("categoryId", "name sizes")
            .select("-createdAt -updatedAt -deleted -__v")
            .then((product) => {
                res.json(product);
            })
            .catch((err) => {
                res.json(formatResponse(4, "L???y d??? li???u th???t b???i!"));
            });
    }

    // GET ALL
    async getAll(req, res) {
        const category = parseInt(req.query.category);
        let products = [];
        if (req.query.page) {
            const page = parseInt(req.query.page);

            if (page < 0) {
                products = [];
            } else {
                let find = {};

                if (category >= 0) {
                    find.categoryId = category;
                }

                products = await Product.find(find)
                    .select("-createdAt -updatedAt -deleted -__v")
                    .populate("categoryId", "name")
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * 10)
                    .limit(10);
            }
        }
        res.json(products);
    }

    // GET MAX PAGE
    async getMaxPage(req, res) {
        const count = await Product.count();
        const maxPage = Math.ceil(count / 10);
        res.json(maxPage ? maxPage : 1);
    }
}

module.exports = new ProductController();
