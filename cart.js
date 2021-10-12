var cart = {
    // (A) PROPERTIES
    hPdt : null, // HTML products list
    hItems : null, // HTML current cart
    items : {}, // Current items in cart
    iURL : "images/", // Product image URL folder
  
    // (B) LOCALSTORAGE CART
    // (B1) SAVE CURRENT CART INTO LOCALSTORAGE
    // https://www.youtube.com/watch?v=GihQAC1I39Q
    save : function () {
      localStorage.setItem("cart", JSON.stringify(cart.items));
    },
  
    // (B2) LOAD CART FROM LOCALSTORAGE
    load : function () {
      cart.items = localStorage.getItem("cart");
      if (cart.items == null) { cart.items = {}; }
      else { cart.items = JSON.parse(cart.items); }
    },
  
    // (B3) EMPTY ENTIRE CART
    nuke : function () {
      if (confirm("Empty cart?")) {
        cart.items = {};
        localStorage.removeItem("cart");
        cart.list();
      }
    },
  
    // (C) INITIALIZE
    init : function () {
      // (C1) GET HTML ELEMENTS
      cart.hPdt = document.getElementById("cart-products");
      cart.hItems = document.getElementById("cart-items");
  
      // (C2) DRAW PRODUCTS LIST
      cart.hPdt.innerHTML = "";
      let p, item, part;
      for (let id in products) {
        // WRAPPER
        p = products[id];
        item = document.createElement("div");
        item.className = "p-item";
        cart.hPdt.appendChild(item);
  
        // PRODUCT IMAGE
        part = document.createElement("img");
        part.src = cart.iURL + p.img;
        part.className = "p-img";
        item.appendChild(part);
  
        // PRODUCT NAME
        part = document.createElement("div");
        part.innerHTML = p.name;
        part.className = "p-name";
        item.appendChild(part);
  
        // PRODUCT DESCRIPTION
        part = document.createElement("div");
        part.innerHTML = p.desc;
        part.className = "p-desc";
        item.appendChild(part);
  
        // PRODUCT PRICE
        part = document.createElement("div");
        part.innerHTML = "Â£" + p.price;
        part.className = "p-price";
        item.appendChild(part);
  
        // ADD TO CART
        part = document.createElement("input");
        part.type = "button";
        part.value = "Add to Cart";
        part.className = "cart p-add";
        part.onclick = cart.add;
        part.dataset.id = id;
        item.appendChild(part);
      }
  
      // (C3) LOAD CART FROM PREVIOUS SESSION
      cart.load();
  
      // (C4) LIST CURRENT CART ITEMS
      cart.list();
    },
  
    // (D) LIST CURRENT CART ITEMS (IN HTML)
    list : function () {
      // (D1) RESET
      cart.hItems.innerHTML = "";
      let item, part, pdt;
      let empty = true;
      for (let key in cart.items) {
        if(cart.items.hasOwnProperty(key)) { empty = false; break; }
      }
  
      // (D2) CART IS EMPTY
      if (empty) {
        item = document.createElement("div");
        item.innerHTML = "Cart is empty";
        cart.hItems.appendChild(item);
      }
  
      // (D3) CART IS NOT EMPTY - LIST ITEMS
      else {
        let p, total = 0, subtotal = 0;
        for (let id in cart.items) {
          // ITEM
          p = products[id];
          item = document.createElement("div");
          item.className = "c-item";
          cart.hItems.appendChild(item);
  
          // NAME
          part = document.createElement("div");
          part.innerHTML = p.name;
          part.className = "c-name";
          item.appendChild(part);
  
          // REMOVE
          part = document.createElement("input");
          part.type = "button";
          part.value = "X";
          part.dataset.id = id;
          part.className = "c-del cart";
          part.addEventListener("click", cart.remove);
          item.appendChild(part);
  
          // QUANTITY
          part = document.createElement("input");
          part.type = "number";
          part.min = 0;
          part.value = cart.items[id];
          part.dataset.id = id;
          part.className = "c-qty";
          part.addEventListener("change", cart.change);
          item.appendChild(part);
  
          // SUBTOTAL
          subtotal = cart.items[id] * p.price;
          total += subtotal;
        }
  
        // TOTAL AMOUNT
        item = document.createElement("div");
        item.className = "c-total";
        item.id = "c-total";
        item.innerHTML ="TOTAL: $" + total;
        cart.hItems.appendChild(item);
  
        // EMPTY BUTTONS
        item = document.createElement("input");
        item.type = "button";
        item.value = "Empty";
        item.addEventListener("click", cart.nuke);
        item.className = "c-empty cart";
        cart.hItems.appendChild(item);
  
        // CHECKOUT BUTTONS
        item = document.createElement("input");
        item.type = "button";
        item.value = "Checkout";
        item.addEventListener("click", cart.checkout);
        item.className = "c-checkout cart";
        cart.hItems.appendChild(item);
      }
    },
  
    // (E) ADD ITEM INTO CART
    add : function () {
      if (cart.items[this.dataset.id] == undefined) {
        cart.items[this.dataset.id] = 1;
      } else {
        cart.items[this.dataset.id]++;
      }
      cart.save();
      cart.list();
    },
  
    // (F) CHANGE QUANTITY
    change : function () {
      // (F1) REMOVE ITEM
      if (this.value <= 0) {
        delete cart.items[this.dataset.id];
        cart.save();
        cart.list();
      }
  
      // (F2) UPDATE TOTAL ONLY
      else {
        cart.items[this.dataset.id] = this.value;
        var total = 0;
        for (let id in cart.items) {
          total += cart.items[id] * products[id].price;
          document.getElementById("c-total").innerHTML ="TOTAL: Â£" + total;
        }
      }
    },
  
    // (G) REMOVE ITEM FROM CART
    remove : function () {
      delete cart.items[this.dataset.id];
      cart.save();
      cart.list();
    },
  
    // (H) CHECKOUT
    checkout : function () {
      // SEND DATA TO SERVER
      // CHECKS
      // SEND AN EMAIL
      // RECORD TO DATABASE
      // PAYMENT
      // WHATEVER IS REQUIRED
      alert("TO DO");
  
      /*
      var data = new FormData();
      data.append('cart', JSON.stringify(cart.items));
      data.append('products', JSON.stringify(products));
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "SERVER-SCRIPT");
      xhr.onload = function(){ ... };
      xhr.send(data);
      */
    }
  };
  window.addEventListener("DOMContentLoaded", cart.init);