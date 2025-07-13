console.log('✅ SCRIPT.JS LOADED');
document.addEventListener("DOMContentLoaded", () => {
  // HOME PAGE SLIDER
  console.log('✅ DOMContentLoaded started');
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const intervalTime = 5000;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) slide.classList.add('active');
    });
  }
  

  if (slides.length > 0) {
    document.querySelector('.arrow.left').addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
    });

    document.querySelector('.arrow.right').addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    });

    setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }, intervalTime);
  }

  // COLLECTIONS PAGE SLIDER
  let c_currentSlide = 0;
  const c_slides = document.querySelectorAll('.c-slide');
  const c_slideContent = document.querySelectorAll('.c-slide-content');
  const c_viewBtn = document.querySelectorAll('.c-view-na-btn');
  const c_totalSlides = c_slides.length;
  const c_intervalTime = 5000;

  function c_showSlide(c_index) {
    c_slides.forEach((c_slide, j) => {
      c_slide.classList.remove('active');
      if (j === c_index) c_slide.classList.add('active');
    });

  }
  function c_showSlideContent(c_index) {
    c_slideContent.forEach((c_slideContent, j) => {
      c_slideContent.classList.remove('active');
      if (j === c_index) c_slideContent.classList.add('active');
    });
  }
  function c_showButton(c_index){
    c_viewBtn.forEach((c_viewBtn, j) => {
      c_viewBtn.classList.remove('active');
      if (j === c_index) c_viewBtn.classList.add('active'); 
    });
  }

  function isActive(c_index){
    if(c_viewBtn.classList.contains('active')){
      console.log("c_viewBtn is active");
    }
    else{
      console.log("c_viewBtn is not active");
    }
  }

  if (c_slides.length > 0) {
    document.querySelector('.c-arrow.left').addEventListener('click', () => {
      c_currentSlide = (c_currentSlide - 1 + c_totalSlides) % c_totalSlides;
      c_showSlide(c_currentSlide);
      c_showSlideContent(c_currentSlide);
      c_showButton(c_currentSlide);
      
    });

    document.querySelector('.c-arrow.right').addEventListener('click', () => {
      c_currentSlide = (c_currentSlide + 1) % c_totalSlides;
      c_showSlide(c_currentSlide);
      c_showSlideContent(c_currentSlide);
      c_showButton(c_currentSlide);
    });

    setInterval(() => {
      c_currentSlide = (c_currentSlide + 1) % c_totalSlides;
      c_showSlide(c_currentSlide);
      c_showSlideContent(c_currentSlide);
      c_showButton(c_currentSlide);
    }, c_intervalTime);
  }
function updateSection(cButtonContent){
  const c_section_h2 = document.querySelector('#c-main-content section h2');
  const c_section_p = document.querySelector('#c-main-content section p');
  
  if(cButtonContent === 'Club'){
    c_section_h2.textContent = 'Club Kits 🔥';
    c_section_p.textContent = 'Jerseys from your favorite clubs';
  }
  else if(cButtonContent === 'National'){
    c_section_h2.textContent = 'National Team Kits 🌍';
    c_section_p.textContent = 'Jerseys from your favorite national teams';
  }
  else if(cButtonContent === 'Limited'){
    c_section_h2.textContent = 'Limited Edition Kits ⭐';
    c_section_p.textContent = 'Exclusive and rare collections';
  }else{
    c_section_h2.textContent = 'Hot selections 🔥';
    c_section_p.textContent = 'selling out fast!';
  }
}
function fetchCollection(cButtonContent){{
  fetch(`/api/collections?category=${encodeURIComponent(cButtonContent)}`)
  .then(response => response.json())
  .then(kitCollections => {
    console.log("data", kitCollections);
    updateSection(cButtonContent);
    const c_itemGroup = document.querySelector('.c-item-group-1');
    c_itemGroup.innerHTML = '';
    if(kitCollections.length === 0){
      c_itemGroup.innerHTML = '<p>No kits available</p>';
      return;
    }
    kitCollections.forEach(kit => {
      const link = document.createElement('a');
      link.href = `kit-info.html?id=${kit._id}`;
      link.className = 'item-link';
      link.innerHTML = `
      <div class="c-item-holder">
      <img src="${kit.image}" alt="${kit.name}" width="200" height="200" />
      <h4>${kit.name}</h4>
      </div>
      `;
      c_itemGroup.appendChild(link);
    });
    })
    .catch(error => {
      console.error("Error fetching collections:", error);
    });
  }
}

  // COLLECTIONS PAGE BUTTONS
  const mainContent = document.getElementById("c-main-content");
  const cViewBtn = document.querySelectorAll('.c-view-na-btn');
  if(cViewBtn && mainContent){
    console.log("mainContent", mainContent);
  console.log("cViewBtn", cViewBtn);

    
    if (cViewBtn.length > 0) {
    console.log("Buttons found:", cViewBtn.length);
    cViewBtn.forEach((button, index) => {
      // Capture the button category immediately
      const buttonCategory = button.getAttribute('data-category');
      fetchCollection('hot');
      button.addEventListener("click", () => {
        alert("Clicked!");
        const cButtonContent = buttonCategory;
        console.log("button", button);
        console.log("buttonclick", cButtonContent); 
        fetchCollection(cButtonContent);
        // Handle different button categories
       
      });
    });
  } else {
    console.error("No buttons with class 'c-view-na-btn' found");
  }


  }
  console.log('✅Hot selections');
  // HOT SELECTIONS REQ
  fetch('/api/hot-selections')
  .then(response => response.json())  
  .then(kits => {
    const hotContainer = document.querySelector('.item-group-1');
    
    if (!hotContainer) {
      console.error('Hot selections container not found');
      return;
    }
    
    //clear existing content
    hotContainer.innerHTML = '';

    if(kits.length === 0){
      hotContainer.innerHTML = '<p>No hot selections available</p>';
      return;
    }

    kits.forEach(kit => {
      const link = document.createElement('a');
      link.href = `kit-info.html?id=${kit._id}`;
      link.className = 'item-link';

      link.innerHTML = ` 
      <div class="item-holder">
      <img src="${kit.image}" alt="${kit.name}" width="200" height="200" />
      <h4>${kit.name}</h4>
      </div> 
      `;
      hotContainer.appendChild(link);
    });
  })
  .catch(error => {
    console.error('Error fetching hot selections:', error);
    const hotContainer = document.querySelector('.item-group-1');
    if (hotContainer) {
      hotContainer.innerHTML = '<p>Error loading hot selections</p>';
    }
  });

  // KIT INFO REQ
  const itemId = getItemIdFromURL();
  if (itemId) {
    fetch(`/api/kit-info?id=${itemId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Kit not found');
        }
        return response.json();
      })
      .then(kit => {
        console.log('Kit info fetched:', kit);
        // Update the page with kit details
        displayKitDetails(kit);
      })
      .catch(error => {
        console.error('Error fetching kit info:', error);
        // Handle error (show error message to user)
      });
  }

  // NEW ARRIVALS REQ
  console.log('✅ New arrivals');
  fetch('/api/new-arrivals')
  .then(response => response.json())
  .then(na_kits => {
    const newArrivalsContainer = document.querySelector('.new-arrival-item-group');
    if(!newArrivalsContainer){
      console.error('New arrivals container not found');
      return;
    }

    newArrivalsContainer.innerHTML = '';

    if(na_kits.length === 0){
      newArrivalsContainer.innerHTML = '<p>No new arrivals available</p>';
      return;
    }

    na_kits.forEach(kit => {
      const link = document.createElement('a');
      link.href = `kit-info.html?id=${kit._id}`;
      link.className = 'item-link';

      link.innerHTML = `
      <div class="item-holder">
      <img src="${kit.image}" alt="${kit.name}" width="200" height="200" />
      <h4>${kit.name}</h4>
      </div>
      `;
      newArrivalsContainer.appendChild(link);
    });
  })
  .catch(error => {   
    console.error('Error fetching new arrivals:', error);
    const newArrivalsContainer = document.querySelector('.item-group-1');
    if (newArrivalsContainer) {
      newArrivalsContainer.innerHTML = '<p>Error loading new arrivals</p>';
    }
  });

  // PLAYER KITS REQ
  const playerName = getPlayerNameFromURL();

  //console.log('Player name:', playerName);
  console.log('✅ Player kits');
  if(playerName){
    fetch(`/api/player-kits?name=${encodeURIComponent(playerName)}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Kit not found');
    }
    return response.json();
  })
  .then(playerKits => {
    console.log('Player kits fetched:', playerKits);
    const playerKitsContainer = document.querySelector('.p-item-group-1');
    const playerHolder = document.querySelector('.player-holder img');
    const playerKitsHeader = document.querySelector('.player-kit-header h2');
    if(!playerKitsContainer){
      console.error('Player kits container not found');
      return; 
    }
    
    playerKitsContainer.innerHTML = '';
    
    if(playerKits.length === 0){
      playerKitsContainer.innerHTML = '<p>No player kits available</p>';
      return;
    }
    playerKitsHeader.textContent = playerName;
    playerHolder.src = `images/${playerName.toLowerCase()}.png`;
    playerKits.forEach(kit => {
      const link = document.createElement('a');
      link.href = `kit-info.html?id=${kit._id}`;
      link.className = 'item-link';
      
      link.innerHTML = `
      <div class="p-item-holder">
      <img src="${kit.image}" alt="${kit.name}" width="200" height="200" />
      <h4>${kit.name}</h4>
      </div>
      `;
      playerKitsContainer.appendChild(link);
    });
  })
  .catch(error => {
    console.error('Error fetching player kits:', error);
    const playerKitsContainer = document.querySelector('.p-item-group-1');
    if (playerKitsContainer) {
      playerKitsContainer.innerHTML = '<p>Error loading player kits</p>';
    }
  });
}
  // ALL KITS REQ
  const sortDropdown = document.getElementById('ak-dropdownButton');
  if (sortDropdown) {
    console.log('Sort dropdown found');
    sortDropdown.addEventListener('change', function() {
      const sortValue = this.value;
      
      fetchAndRenderKits(sortValue);
      
    });
  }

  // Initial load (default sort)
  console.log('✅ All kits');
  fetchAndRenderKits('');

  function fetchAndRenderKits(sortOrder) {  
    let url = '/api/all-kits';
    if (sortOrder === 'a to z' || sortOrder === 'z to a') {
      url = `/api/sort-kits/${encodeURIComponent(sortOrder)}`;
      console.log('Sort value::', sortOrder);
    }
    fetch(url)
      .then(response => response.json())
      .then(allKits => {
        const allKitsContainer = document.querySelector('.ak-item-group'); 
        if(!allKitsContainer){
          console.error('All kits container not found');
          return;
        }
        allKitsContainer.innerHTML = '';

        if(allKits.length === 0){
          allKitsContainer.innerHTML = '<p>No kits available</p>';
          return;
        }

        allKits.forEach(kit => {
          const link = document.createElement('a');
          link.href = `kit-info.html?id=${kit._id}`;
          link.className = 'item-link';

          link.innerHTML = `
          <div class="ak-item">
          <img src="${kit.image}" alt="${kit.name}" width="200" height="200" />
          <h4>${kit.name}</h4>
          </div>
          `;
          allKitsContainer.appendChild(link);
        });
      })
      .catch(error => {
        console.error('Error fetching all kits:', error);   
      });
  }

  // SEARCH FUNCTIONALITY
  console.log('✅ Search functionality');
  const searchButton = document.getElementById('search-button');
if (searchButton) {
  searchButton.addEventListener('click', function() {
    const searchInput = document.getElementById('search-bar').value;
    console.log('Search input:', searchInput);
    searchKits(searchInput);
  });
}

 

  function searchKits(searchInput) {
    if(searchInput != "search kits..."){
      fetch(`/api/search-kits?search=${encodeURIComponent(searchInput)}`)
      .then(response => response.json())
      .then(searchResults => {
        console.log('Search results:', searchResults);
        const searchResultsContainer = document.querySelector('.ak-item-group');
        if(!searchResultsContainer){
          console.error('Search results container not found');
          return;
        }
        searchResultsContainer.innerHTML = '';
        if(searchResults.length === 0){
          console.log('No search results found');
          searchResultsContainer.innerHTML = '<p>No search results found for ' + searchInput + '</p>';  
          return;
        }
        
        searchResults.forEach(kit => {
          const link = document.createElement('a');
          link.href = `kit-info.html?id=${kit._id}`;
          link.className = 'item-link';
          link.innerHTML = `
          <div class="ak-item">
          <img src="${kit.image}" alt="${kit.name}" width="200" height="200" />
          <h4>${kit.name}</h4>
          </div>
          `;
          searchResultsContainer.appendChild(link);
        });
      })
      .catch(error => {
        console.error('Error searching kits:', error);
      });
    }
    else{
      console.log('Search input is empty');
    }
    }

    console.log('✅ Cart');

    //  CART 
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

      if(cart.length === 0){
        cartItemGroup.innerHTML = '<p>No items in cart</p>';
        return;
      }
      cartItemGroup.innerHTML = '';

      cart.forEach(kit => {
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
            <button class="remove-btn" data-id="${kit._id}">Remove</button>
          </div>
          </div>
        `;
        
        cartItemGroup.appendChild(itemHolder);
      });

      // Add event listeners for remove buttons
      document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
          const kitId = this.getAttribute('data-id');
          removeFromCart(kitId);
        });
      });
    })
    .catch(error => {
      console.error('Error fetching cart:', error);
      const cartItemGroup = document.querySelector('.atc-item-group');
      if(cartItemGroup){
        cartItemGroup.innerHTML = '<p>Error loading cart. Please try again.</p>';
      }
    });

    // Function to remove item from cart
    function removeFromCart(kitId) {
      fetch(`/api/remove-from-cart?id=${kitId}`)
        .then(response => response.json())
        .then(cart => {
          console.log('Item removed from cart:', cart);
          // Reload the cart display
          location.reload();
        })
        .catch(error => {
          console.error('Error removing from cart:', error);
        });
    }

        // <p>Size: ${selectedSize}</p>
        // <p>Addons: ${selectedAddon}</p>



});






// ITEM PAGE
const dropdownLinks = document.querySelectorAll('.dropdown-content a');
const dropdownButton = document.getElementById('dropdownButton');

const dropdownLinksB = document.querySelectorAll('.dropdown-content-b a');
const dropdownButtonB = document.getElementById('dropdownButton-b');
const dropdownContentB = document.querySelector('.dropdown-content-b');
// ALL KITS SORTING
const akDropdownButton = document.getElementById('ak-dropdownButton');
const akDropdownContent = document.querySelector('.ak-dropdown-content');
const akDropdownLinks = document.querySelectorAll('.ak-dropdown-content a');

// Function to get ID from URL
function getItemIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

function getPlayerNameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return decodeURIComponent(params.get('name') || '');
}

// Example usage:

// Function to display kit details on the page
function displayKitDetails(kit) {
  console.log('✅ Displaying kit details');
  // Update page elements with kit data based on the actual HTML structure
  const kitNameElement = document.querySelector('.kit-info h2');
  const kitPriceElement = document.querySelector('.kit-info h3');
  const kitImageElement = document.querySelector('.kit-header img');
  const kitDescriptionElement = document.querySelector('.kit-description p');

  const sizeBtn1 = document.getElementById('size-btn-1');
  const sizeBtn2 = document.getElementById('size-btn-2');
  const sizeBtn3 = document.getElementById('size-btn-3');
  const addonsBtn = document.getElementById('dropdownButton-b');
   
  const dropdownContentB = document.querySelector('.dropdown-content-b');

  const atcBtn = document.querySelector('.atc-btn');

  let selectedSize = '';
  let selectedAddon = '';

  sizeBtn1.addEventListener('click', function() {
    console.log('Size button 1 clicked');
    selectedSize = this.getAttribute('data-value');
  });
  sizeBtn2.addEventListener('click', function() {
    console.log('Size button 2 clicked');
    selectedSize = this.getAttribute('data-value');
  });
  sizeBtn3.addEventListener('click', function() {
    console.log('Size button 3 clicked');
    selectedSize = this.getAttribute('data-value');
  });
  
  if (kitNameElement) kitNameElement.textContent = kit.name;
  if (kitPriceElement) kitPriceElement.textContent = `$${kit.price}`;
  if (kitImageElement) kitImageElement.src = kit.image;
  if (kitDescriptionElement) kitDescriptionElement.textContent = kit.description;
  
  const sizeBtns = [sizeBtn1, sizeBtn2, sizeBtn3];

  for(let i = 0; i < 3; i++){
  if(kit.stock[i] <= 0){
   sizeBtns[i].style.display = 'none';
  }
  }
  if(kit.addons.length > 0){
    dropdownContentB.innerHTML = '';
    for(let i = 0; i < kit.addons.length; i++){
      const aLink = document.createElement('a');
      aLink.href = '#';
      aLink.setAttribute('data-value', kit.addons[i]);
      aLink.textContent = kit.addons[i];
      dropdownContentB.appendChild(aLink);
    }
    dropdownContentB.addEventListener('click', function(e) {
      if(e.target.matches('a[data-value]')){
        e.preventDefault();
        const selected = e.target.getAttribute('data-value');
        console.log('Selected addon:', selected);
        selectedAddon = selected;
      }
    });
  }
  else{
    dropdownContentB.innerHTML = '<p>No addons available</p>';
  }
  atcBtn.addEventListener('click', function() {
    if(selectedSize === ''){
      alert('Please select a size');
      return;
    }else{
      
      console.log('Add to cart button clicked');
      fetch(`/api/add-to-cart?id=${kit._id}&size=${selectedSize}&addon=${selectedAddon}`)
      .then(response => response.json())
      .then(kits => {
        console.log('Add to cart response:', kits);
        window.location.href = 'addtocart.html';
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
      });
    }

    
  });
  console.log('Kit details updated:', kit);
}

dropdownLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // Prevent link navigation
    const selected = this.getAttribute('data-value');
    console.log('Selected size:', selected);
    dropdownButton.textContent = selected;
  });
});

// dropdownLinksB.forEach(link => {
//   link.addEventListener('click', function(e) {
//     e.preventDefault(); // Prevent link navigation
//     const selected = this.getAttribute('data-value');
//     console.log('Selected addon:', selected); 
//     dropdownButtonB.textContent = selected;
//   });
// });

dropdownContentB.addEventListener('click', function(e) {
  if(e.target.matches('a[data-value]')){
    e.preventDefault();
    const selected = e.target.getAttribute('data-value');
    console.log('Selected addon:', selected);
    dropdownButtonB.textContent = selected;
  }
});

akDropdownLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // Prevent link navigation
    const selected = this.getAttribute('data-value'); 
    akDropdownButton.textContent = selected;
  });
});




