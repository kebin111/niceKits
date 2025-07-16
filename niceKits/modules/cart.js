    export function fetchCart(){
         fetch('/api/get-cart')
    .then(response => {
      console.log('response', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(cart => {
      console.log('Cart:', cart);
      const cartItemGroup = document.querySelector('.atc-container');
   
      if(!cartItemGroup){
        console.error('Cart item group not found');
        return;
      }

      if(cart.cart.length === 0){
        updateCartHeader(cart);
        cartItemGroup.innerHTML = '<p>No items in cart</p>';
        return;
      }
      updateCartHeader(cart);
      cartItemGroup.innerHTML = '';

      cart.cart.forEach(kit => {
        const itemHolder = document.createElement('div');
        itemHolder.className = 'atc-item-group';
        itemHolder.innerHTML = `
        <div class="atc-item-holder">
          <img src="${kit.image}" alt="${kit.name}" width="200" height="200" />
          <div class="atc-item-info">
            <h4>${kit.name}</h4>
            <p>Price: $${kit.price}</p>
            ${kit.selectedSize ? `<p>Size: ${kit.selectedSize}</p>` : ''}
            ${kit.selectedAddon ? `<p>Addon: ${kit.selectedAddon}</p>` : '<p>Addon: None</p>'}
            <p>Quantity: ${kit.quantity || 1}</p>
            <div class="atc-btn-group">
              <button class="remove-btn" data-id="${kit.cartId}"><img src="images/trash.png" alt="remove" width="20" height="20"></button>
              <button class="plus-btn" data-id="${kit._id}"><img src="images/plus.png" alt="plus" width="20" height="20"></button>
              <button class="minus-btn" data-id="${kit._id}"><img src="images/minus.png" alt="minus" width="20" height="20"></button>
            </div>
          </div>
          </div>
        `;

        cartItemGroup.appendChild(itemHolder);
      });

      // Add event listeners for remove buttons
      document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
          const cartId = this.getAttribute('data-id');
          removeFromCart(cartId);
        });
      });

      document.querySelectorAll('.plus-btn').forEach(button => {  
        button.addEventListener('click', function() {
          console.log('Plus button clicked');
          const kitId = this.getAttribute('data-id');
          for(let i = 0; i < cart.cart.length; i++){
            if(cart.cart[i]._id === kitId){
              switch(cart.cart[i].selectedSize){
                case 'Small':
                  if(cart.cart[i].quantity < cart.cart[i].stock[0]){
                    incrementQuantity(cart.cart[i].cartId);
                  }else{
                    alert('Stock is limited');
                  }
                  break;
                case 'Medium':
                  if(cart.cart[i].quantity < cart.cart[i].stock[1]){
                    incrementQuantity(cart.cart[i].cartId);
                  }else{
                    alert('Stock is limited');
                  }
                  break;
                case 'Large':
                  if(cart.cart[i].quantity < cart.cart[i].stock[2]){
                    incrementQuantity(cart.cart[i].cartId);
                  }else{
                    alert('Stock is limited');
                  }
                  break;
              }
            }
          }
          console.log('Cart:', cart.cart);
        });
      });
      document.querySelectorAll('.minus-btn').forEach(button => {  
        button.addEventListener('click', function() {
          console.log('Minus button clicked');
          const kitId = this.getAttribute('data-id');
          for(let i = 0; i < cart.cart.length; i++){
            if(cart.cart[i]._id === kitId){

                  if(cart.cart[i].quantity > 1){
                      decrementQuantity(cart.cart[i].cartId);     
                  }else{
                    removeFromCart(cart.cart[i].cartId);
                  }
            }                                                       
          } 
          console.log('Cart:', cart.cart);
        });
      });
      document.querySelector('.clear-cart-btn').addEventListener('click', clearCart);

      document.querySelector('.checkout-btn').addEventListener('click', checkout);
    })
    .catch(error => {
      console.error('Error fetching cart:', error);
      const cartItemGroup = document.querySelector('.atc-item-group');
      if(cartItemGroup){
        cartItemGroup.innerHTML = '<p>Error loading cart. Please try again.</p>';
      }
    });

    }
   

    // Function to remove item from cart
    function removeFromCart(cartId) {
      fetch(`/api/remove-from-cart?id=${cartId}`)
        .then(response => response.json())
        .then(cart => {
          console.log('Item removed from cart:', cart);
          updateCartHeader(cart);
          // Reload the cart display
          location.reload();
        })
        .catch(error => {
          console.error('Error removing from cart:', error);
        });
    }

    function clearCart(){
      fetch('/api/clear-cart')
      .then(response => response.json())
      .then(cart => {
        console.log('Cart cleared:', cart);
        updateCartHeader(cart);
        location.reload();
      })
      .catch(error => {
        console.error('Error clearing cart:', error);
      });
    }

    function updateCartHeader(cart){
        const cartHeader = document.querySelector('.atc-header');

        let total = cart.cart.reduce((acc, kit) => acc + kit.price * kit.quantity, 0);
        let items = cart.cart.reduce((acc, kit) => acc + kit.quantity, 0);
        cartHeader.innerHTML = '';
        cartHeader.innerHTML = `
        <section>
        <h2>My Cart</h2> 
        <h3>Total: $${total}</h3>
        <h3>Items: ${items}</h3>
        <h3>Wallet: $${cart.wallet}</h3>
        </section>
        `;
    }

    function incrementQuantity(cartId){
      fetch(`/api/increment-quantity?id=${cartId}`)
      .then(response => response.json())
      .then(cart => {
        console.log('Quantity incremented:', cart);
        updateCartHeader(cart);
        location.reload();
      });
    }

    function decrementQuantity(cartId){
      fetch(`/api/decrement-quantity?id=${cartId}`)
      .then(response => response.json())
      .then(cart => {
        console.log('Quantity decremented:', cart);
        updateCartHeader(cart);
        location.reload();
      });
    }

    function checkout(){
      fetch('/api/checkout')
      .then(response => response.json())
      .then(cart => {
        console.log('Checkout:', cart);
        updateCartHeader(cart);
        location.reload();
      });
    }