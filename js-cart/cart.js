var cart = {
 
  hPdt : null,        // setting them a temporary variable to null
  hItems : null, // HTML current cart
  items : {}, // Current items in cart
  iURL : "../images/", // Product image URL folder

  //session storage
  // saves within the session storage 
  save : function () {
    sessionStorage.setItem("cart", JSON.stringify(cart.items));
  },

  // this loads the cart within session storage
  loadCart : function () {
    cart.items = sessionStorage.getItem("cart");
    if (cart.items == null) { cart.items = {}; }
    else { cart.items = JSON.parse(cart.items); }
  },

  // sets car.item it.
  cancel: function () {
    if (confirm("Empty cart?")) {  // you click yes or no if you want to empty the cart
      cart.items = {}; // empties out the cart if there are items in it
    sessionStorage.removeItem("cart");
      cart.list();
    }
  },

 
  init : function () { // adds all information and repeats it when you add someting on the pets variable
    
    cart.hPdt = document.getElementById("cart-products"); //hpdt is assagined to the elements cart products 
    cart.hItems = document.getElementById("cart-items");

    // this is for the pets list
    cart.hPdt.innerHTML = "";
    let p, item, part; // assigning 3 variables
    for (let id in products) { // this is a for loop, it gets EACH OF THE PRODUCTS AND ASSIGN IT to THE ID
      // WRAPPER
      p = products[id]; // its tsking the image, name ,discription and price and wrapping them up into 1  element
      item = document.createElement("div"); 
      item.className = "p-item";
      cart.hPdt.appendChild(item);

      // the pets images 
      part = document.createElement("img");
      part.src = cart.iURL + p.img;
      part.className = "p-img";
      item.appendChild(part);

      // pet names
      part = document.createElement("div");
      part.innerHTML = p.name; // its giving it a source
      part.className = "p-name";
      item.appendChild(part); 

      //
      part = document.createElement("div");
      part.innerHTML = p.desc;
      part.className = "p-desc";      // classname can return the value of element. it can also be changed if needed
      item.appendChild(part);

      // pricing of the pets 
      part = document.createElement("div");
      part.innerHTML = "£" + p.price; // displays the £ sign on the total amount within the basket 
      part.className = "p-price";
      item.appendChild(part);

      // adding pets to the cart
      part = document.createElement("input");
      part.type = "button";       // adds the pets you want in the cart when the button is clicked
      part.value = "Add to Cart";
      part.className = "cart p-add";
      part.onclick = cart.add;
      part.dataset.id = id;
      item.appendChild(part);
    }

    // loads the shopping cart from the last session
    cart.load();            

     // lists the currant cart pets 
    cart.list();        
  },

  
  list : function () {
    
    cart.hItems.innerHTML = "";
    let item, part, pdt;  // creating 3 variables and not assagning them
    let empty = true;
    for (let key in cart.items) { // loops through the ID of the product added to the cart
      if(cart.items.hasOwnProperty(key)) { empty = false; break; } 
    } //if its not a product it breaks it does nothing

   // cart is empty within javascript
    if (empty) {
      item = document.createElement("div");
      item.innerHTML = "Cart is empty";
      cart.hItems.appendChild(item); 
    }

    
    else {
      let p, total = 0, subtotal = 0; //creating 3 variables
      for (let id in cart.items) { //looping through list of items in the cart
        // pets
        p = products[id]; // grabs the item and creates a div
        item = document.createElement("div");
        item.className = "c-item";
        cart.hItems.appendChild(item);

        // loops through name of pets e.g. dog , cats, rabbits
        part = document.createElement("div");
        part.innerHTML = p.name;
        part.className = "c-name"; // looping through each of these for the shopping cart e.g. name, remove and quantity
        item.appendChild(part);

        // loops through remove
        part = document.createElement("input");
        part.type = "button";
        part.value = "X";                  // looping through each of these for the shopping cart e.g. name, remove and quantity
        part.dataset.id = id;
        part.className = "c-del cart";
        part.addEventListener("click", cart.remove);
        item.appendChild(part);

        // loops through quantity of pets
        part = document.createElement("input");
        part.type = "number";
        part.min = 0;
        part.value = cart.items[id];     // looping through each of these for the shopping cart e.g. name remove and quantity
        part.dataset.id = id;
        part.className = "c-qty";
        part.addEventListener("change", cart.change);
        item.appendChild(part);

        // adds overall totals within cart
        subtotal = cart.items[id] * p.price;
        total += subtotal;  
      }

      // the total price of pets depending on quantity
      item = document.createElement("div");  // getting each of the items and adding them into the total and displaying them
      item.className = "c-total";
      item.id = "c-total";
      item.innerHTML ="TOTAL: £" + total; 
      cart.hItems.appendChild(item);

      
      item = document.createElement("input");
      item.type = "button";                   // it clears the cart when you click the empty button for the cart
      item.value = "Empty";
      item.addEventListener("click", cart.cancel);
      item.className = "c-empty cart";
      cart.hItems.appendChild(item);

     // the checkouts
      item = document.createElement("input");
      item.type = "button";                   // you input a pet in the cart and click checkout 
      item.value = "Checkout";
      item.addEventListener("click", cart.checkout); 
      item.className = "c-checkout cart";
      cart.hItems.appendChild(item);
    }
  },

  
  add : function () {            // adds items to the cart
    if (cart.items[this.dataset.id] == undefined) {  //if 123 doesnt exist in cart it adds 1
      cart.items[this.dataset.id] = 1;// if car is  empty it adds 1 to it
    } else {                  
      cart.items[this.dataset.id]++;  // if there is items it will be equal to however many items you put in the cart
    }
    cart.save();   // you save it then list it
    cart.list(); 
  },

  // quantity
  change : function () {
    
    if (this.value <= 0) { //if the value is less than or equal to 0 delete item from the cart
      delete cart.items[this.dataset.id]; //delete if less than 0
      cart.save();
      cart.list();
    }

    // updating on the total amount
    else {
      cart.items[this.dataset.id] = this.value;
      var total = 0; //creates a new total variable
      for (let id in cart.items) {
        total += cart.items[id] * products[id].price;  // getting the price adding to the total and re-rendering it 
        document.getElementById("c-total").innerHTML ="TOTAL: £" + total;
      }
    }
  },

  //
  remove : function () { //id of your products. it gets pets into cart and  deletes it
    delete cart.items[this.dataset.id];
    cart.save();
    cart.list();
  },

  
  checkout : function () {  
    // displays an alert box e.g. "THANK YOU FOR YOUR PURCHHASE"

   alert("THANK YOU FOR YOUR PURCHASE");   //alert

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