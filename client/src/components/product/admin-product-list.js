import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { fetchAdminProducts, deleteProduct, PRODUCT_EXCEL_DOWNLOAD_URL } from "../../actions/index"
import { Link } from "react-router-dom";

import Paging from "../paging"
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

import showAlertBox from "../../tools/tools"

import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import bootbox from "bootbox"
window.jQuery = $;
require('bootstrap');

class AdminProductList extends Component {
    constructor(props) {
        super(props);

        this.toggleBlocking = this.toggleBlocking.bind(this);
        this.state = {
            blocking: false,
        };
    }

    toggleBlocking(status) {
        this.setState({ blocking: status });
    }
    componentWillMount() {
        //this.toggleBlocking();
        this.toggleBlocking(true)
        const page = this.props.page;
        this.props.fetchAdminProducts(page);

    }
    componentWillReceiveProps(nextProps) {
        const page = nextProps.page;
        this.toggleBlocking(false)
        if (nextProps.status === 204) {
            this.toggleBlocking(true)
            showAlertBox("Produc was deleted successfully", "alert-success");
            this.props.fetchAdminProducts(page);
        }
        else if (nextProps.status === 400) {
            showAlertBox(nextProps.message, "alert-danger");
        }
        if (this.props.page !== page) {
            this.toggleBlocking(true)
            this.props.fetchAdminProducts(page);
        }
        else {
            this.toggleBlocking(false)
        }
    }
    currencyFormat(num) {
        if (num !== "") {
            num = parseFloat(num)
            return "$" + num
                .toFixed(2) // always two decimal digits
                .replace(",", ".") // replace decimal point character with ,
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") //+ " €" // use . as a separator
        }
    }

    deleteProduct(id) {
        if (id !== 0 && id !== undefined) {
            const page = this.props.page;
            bootbox.confirm({
                message: "You want to delete product! Are you sure?",
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {
                    if (result) {
                        this.toggleBlocking(true);
                        this.props.deleteProduct(id);

                    }
                }.bind(this)
            });

        }
    }
    renderProducts() {

        return this.props.products.map((product) => {
            return (
                <tr id={product._id} key={product._id}>
                    <td> {product._id} </td>
                    <td> {product.category.categoryName} </td>
                    <td> {product.productName} </td>
                    <td> {this.currencyFormat(product.unitPrice)} </td>
                    <td> {product.unitsInStock} </td>
                    <td> {product.quantityPerUnit} </td>
                    <td>
                        <a className="btn btn-sm btn-danger pull-right" title="Delete" onClick={() => this.deleteProduct(product._id)} >
                            <i className="glyphicon glyphicon-trash"></i>
                        </a>
                        <Link className="btn btn-sm btn-warning pull-right button-margin" title="Edit" to={"/admin/product/productform/" + product._id} >
                            <i className="glyphicon glyphicon-edit"></i>
                        </Link>
                    </td>
                </tr>
            );
        })
    }
    render() {
        if (this.props.products.length === 0) {
            return (
                <BlockUi tag="div" blocking={this.state.blocking}> <div>Loading...</div> </BlockUi>
            )
        }
        const marginright = {
            margin: "0 0 0 10px"
        }
        return (

            <div className="col-md-12 col-sm-12">
                <BlockUi tag="div" blocking={this.state.blocking}>
                    <Link to="/admin/product/productform" className="btn btn-sm btn-primary pull-right">
                        <i className="glyphicon glyphicon-plus"></i>
                        Add New Product </Link>
                    <table className="table table-responsive">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>CategoryName</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Quantity Per Unit</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderProducts()}
                        </tbody>
                    </table>
                    <Paging url="/admin/products"
                        type="adminProducts"
                        PageSize={this.props.PageSize}
                        PageCount={this.props.PageCount}
                    />
                </BlockUi>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        products: state.products.products,
        PageSize: state.products.PageSize,
        PageCount: state.products.PageCount,
        message: state.products.message,
        status: state.products.status,
        statusClass: state.products.statusClass
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchAdminProducts: fetchAdminProducts,
        deleteProduct: deleteProduct
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminProductList)