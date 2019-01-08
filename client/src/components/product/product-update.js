import React, { Component } from "react";
import { fetchCategories, updateProduct, productDetail } from "../../actions/index";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import TextField from "material-ui/TextField";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import PropTypes from "prop-types"
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

import showAlertBox from "../../tools/tools"

const validate = values => {
    const errors = {}
    const requiredFields = ['productName', 'unitPrice', 'unitsInStock', 'categoryID', 'quantityPerUnit']
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })
    return errors
}

const renderTextField = ({ input, label, type, defaultValue, name, id, meta: { touched, error }, ...custom }) => (

    <TextField hintText={label}
        floatingLabelText={label}
        className="text-field"
        defaultValue={defaultValue}
        type={type}
        id={id}
        onChange={(event) => input.onChange(event.target.value)}
        onBlur={(event) => input.onBlur(event.target.value)}
        errorText={touched && error}
        {...custom}
    />
)

const renderSelectField = ({ input, label, defaultValue, meta: { touched, error }, children, ...custom }) => (

    <SelectField
        floatingLabelText={label}
        className="select-field"
        errorText={touched && error}
        {...input}
        //value={defaultValue}
        onChange={(event, index, value) => input.onChange(value)}
        children={children}
        {...custom} />

)


class ProductUpdateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blocking: false,
            productName: '',
            unitPrice: 0,
            unitsInStock: 0,
            categoryID: 0,
            quantityPerUnit: '',
            done: false
        };
    }
    toggleBlocking(status) {
        this.setState({ blocking: status });
    }
    componentWillMount() {
        this.setState({
            done: false
        });
        this.props.fetchCategories();
        var productId = this.props.productId;
        if (productId === '0' && productId === undefined) {
            this.context.router.history.push("/admin/products")
        }
        this.props.productDetail(productId);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.status === 204) {
            this.toggleBlocking(false)
            showAlertBox("Product was updated successfully", "alert-success");
            this.context.router.history.replace("/admin/products")
        }
        else if (nextProps.status === 400) {
            this.toggleBlocking(false)
            showAlertBox(nextProps.message, "alert-danger");
        }
        if (nextProps.product !== this.props.product) {
            this.setState({
                productName: nextProps.product.productName,
                unitPrice: nextProps.product.unitPrice,
                unitsInStock: nextProps.product.unitsInStock,
                categoryID: nextProps.product.categoryID,
                quantityPerUnit: nextProps.product.quantityPerUnit,
                done: true
            });
        }
    }
    onSubmit(props) {
        this.toggleBlocking(true)
        this.props.updateProduct(props);
    }
    renderCategoryItem() {
        return this.props.categories.map((category) => {
            return (
                <MenuItem key={category._id} value={category._id} primaryText={category.categoryName} />
            );
        })
    }

    render() {
        if (!this.state.done) {
            return (
                <div>Loading...</div>
            )
        }
        const { handleSubmit } = this.props
        //const { handleSubmit, pristine, reset, submitting } = this.props
        return (
            <div className="col-md-12 col-sm-12">
                <BlockUi tag="div" blocking={this.state.blocking}>
                    <div className="page-header">
                        <h4 className="text-primary"> Update product </h4>
                    </div>
                    <div className="container">
                        <MuiThemeProvider muiTheme={getMuiTheme()}>
                            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                                <div className="form-group">
                                    <Field type="text" name="productName" id="productName" defaultValue={this.state.productName} component={renderTextField} label="Product Name" />
                                </div>
                                <div>
                                    <Field type="number" name="unitPrice" defaultValue={this.state.unitPrice} component={renderTextField} label="Price" />
                                </div>
                                <div>
                                    <Field type="number" name="unitsInStock" defaultValue={this.state.unitsInStock} component={renderTextField} label="Units In Stock" />
                                </div>
                                <div>
                                    <Field name="categoryID" defaultValue={this.state.categoryID} component={renderSelectField} label="Category">
                                        {this.renderCategoryItem()}
                                    </Field>
                                </div>
                                <div>
                                    <Field name="quantityPerUnit" defaultValue={this.state.quantityPerUnit} component={renderTextField} label="Quantity Per Unit" multiLine={true} rows={2} />
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-primary">Update</button>
                                    <Link to="/admin/products" className="btn btn-default">Go Back</Link>
                                </div>
                            </form>
                        </MuiThemeProvider>
                    </div>
                </BlockUi>
            </div>
        )
    }
}


function mapStateToProps(state) {
    //console.log(state.adminProducts);
    return {
        categories: state.categories.categories,
        product: state.products.product,
        initialValues: state.products.product,
        message: state.products.message,
        status: state.products.status,
        statusClass: state.products.statusClass
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchCategories: fetchCategories,
        updateProduct: updateProduct,
        productDetail: productDetail
    }, dispatch);
}

ProductUpdateForm.contextTypes = {
    router: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'ProductUpdate',
    enableReinitialize: true,
    validate
})(ProductUpdateForm));

// export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
//     form: 'loginForm',
//     validate
// })(LoginForm));



// ProductUpdateForm = reduxForm({
//     form: 'ProductUpdateForm',
//     enableReinitialize: true,
//     validate
// })(ProductUpdateForm)

// ProductUpdateForm = connect(mapStateToProps, mapDispatchToProps)(ProductUpdateForm)

// export default ProductUpdateForm
