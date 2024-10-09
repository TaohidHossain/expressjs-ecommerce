const express = require('express')
const { productController, authController } = require('../../Controllers')
const { allowAcces } = require('../../Controllers/authController')
const router = express.Router()

router.route('/info')
    .get((req, res) => {
        res.status(200).json({
            "success": true,
            "path": req.baseUrl
        })
    })

router.route('/')
    .get(authController.protect, productController.getAllProducts)
    .post(authController.protect, allowAcces(['admin', 'staff']), productController.createProduct)

router.route('/:id')
    .get(authController.protect, productController.getProduct)
    .patch(authController.protect, allowAcces(['admin', 'staff']), productController.updateProduct)
    .delete(authController.protect, allowAcces(['admin', 'staff']), productController.deleteProduct)

module.exports = router