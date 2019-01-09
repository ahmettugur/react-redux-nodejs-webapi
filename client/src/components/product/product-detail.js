import React, { Component } from "react";
import io from "socket.io-client";
import { connect } from "react-redux";
import { productDetail, addToCart } from "../../actions/index";

import $ from "jquery";
import "bootstrap/dist/css/bootstrap.css";
import bootbox from "bootbox";
window.jQuery = $;
require("bootstrap");

class ProductDetail extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const productId = this.props.match.params.productId;
    this.props.productDetail(productId);
  }

  componentDidMount() {
    const socket = io("http://localhost:4000");

    const productId = this.props.match.params.productId;

    socket.emit("roomName", { roomName: productId });

    socket.on("pushNotify", data => {
      console.log(data.product.unitsInStock)
      if (parseInt(data.product.unitsInStock)  <= 0) {
        bootbox.alert({
          message: "Product stock chnaged!",
          size: "small"
        });
       
      }
      this.setDisplay(data.product.unitsInStock)
      // alert(data.product.productName)
    });
  }

  setDisplay(unitsInStock) {
    if (unitsInStock <= 0) {
      $("#quantityBox").removeClass("displayBlock");
      $("#addtoCartBox").removeClass("displayBlock");

      $("#quantityBox").addClass("displayNone");
      $("#addtoCartBox").addClass("displayNone");

      $("#outofStockBox").removeClass("displayNone");
      $("#outofStockBox").addClass("displayBlock");
    } else {
      $("#quantityBox").removeClass("displayNone");
      $("#addtoCartBox").removeClass("displayNone");

      $("#quantityBox").addClass("displayBlock");
      $("#addtoCartBox").addClass("displayBlock");

      $("#outofStockBox").removeClass("displayBlock");
      $("#outofStockBox").addClass("displayNone");
    }
  }
  addToCarts() {
    const productId = this.props.match.params.productId;
    this.props.addToCart(productId).then(() => {
      bootbox.alert({
        message: "Your product added succcesfully!",
        size: "small"
      });
    });
    //$('.modal').modal('show');
  }
  decrease() {
    var val = document.getElementById("quantity").value;
    if (!isNaN(val)) {
      if (parseInt(val) - 1 > 0) {
        val--;
      }
      document.getElementById("quantity").value = val;
    } else {
      document.getElementById("quantity").value = "1";
    }
  }
  increment() {
    var val = document.getElementById("quantity").value;
    if (!isNaN(val)) {
      val++;
      document.getElementById("quantity").value = val;
    } else {
      document.getElementById("quantity").value = "1";
    }
  }
  renderproduct(product) {
    var imgStyle = {
      width: "100%"
    };
    var priceStyle = {
      marginTop: "0%"
    };
    var borderStyle = {
      border: "0px solid gray"
    };
    var paddingBottom = {
      paddingBottom: "20px"
    };
    var marginRight = {
      marginRight: "20px"
    };
    var cursorPointer = {
      cursor: "pointer"
    };
    var displayStyle = {
      display: "inline-block"
    };

    let displayClass = "";
    let displayClass2 = "";

    if (product.unitsInStock > 0) {
      displayClass = "section displayBlock";
      displayClass2 = "section displayNone";
    } else {
      displayClass = "section displayNone";
      displayClass2 = "section displayBlock";
    }

    return (
      <div>
        <div className="col-xs-4 item-photo">
          <img style={imgStyle} src="/images/product.jpg" />
        </div>
        <div className="col-xs-5" style={borderStyle}>
          <h3>{product.productName}</h3>
          <h6 className="title-price">
            <small>Price</small>
          </h6>
          <h3 style={priceStyle}>
            $ <span id="price">{product.unitPrice}</span>
          </h3>

          <div className={displayClass} style={paddingBottom} id="quantityBox">
            <h6 className="title-attr">
              <small>Quantity</small>
            </h6>
            <div>
              <div
                className="btn-minus"
                onClick={() => this.decrease()}
                style={displayStyle}
              >
                <span className="glyphicon glyphicon-minus" />
              </div>
              <input defaultValue="1" id="quantity" />
              <div
                className="btn-plus"
                onClick={() => this.increment()}
                style={displayStyle}
              >
                <span className="glyphicon glyphicon-plus" />
              </div>
            </div>
          </div>
          <div className={displayClass} style={paddingBottom} id="addtoCartBox">
            <button
              onClick={() => {
                this.addToCarts();
              }}
              className="btn btn-success"
            >
              <span
                style={marginRight}
                className="glyphicon glyphicon-shopping-cart"
                aria-hidden="true"
              />
              Add to cart
            </button>
          </div>
          <div
            className={displayClass2}
            style={paddingBottom}
            id="outofStockBox"
          >
            <span style={marginRight} aria-hidden="true" />
            The product is outof stock
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.product) {
      return <h1>Loading</h1>;
    } else {
      return this.renderproduct(this.props.product);
    }
  }
}

const mapStateToProps = state => {
  return {
    product: state.products.product
  };
};

const mapDispatchToProps = {
  productDetail: productDetail,
  addToCart: addToCart
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetail);
