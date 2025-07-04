document.addEventListener("DOMContentLoaded", () => {
  // HOME PAGE SLIDER
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
  const c_totalSlides = c_slides.length;
  const c_intervalTime = 5000;

  function c_showSlide(c_index) {
    c_slides.forEach((c_slide, j) => {
      c_slide.classList.remove('active');
      if (j === c_index) c_slide.classList.add('active');
    });

  }

  if (c_slides.length > 0) {
    document.querySelector('.c-arrow.left').addEventListener('click', () => {
      c_currentSlide = (c_currentSlide - 1 + c_totalSlides) % c_totalSlides;
      c_showSlide(c_currentSlide);
    });

    document.querySelector('.c-arrow.right').addEventListener('click', () => {
      c_currentSlide = (c_currentSlide + 1) % c_totalSlides;
      c_showSlide(c_currentSlide);
    });

    setInterval(() => {
      c_currentSlide = (c_currentSlide + 1) % c_totalSlides;
      c_showSlide(c_currentSlide);
    }, c_intervalTime);
  }

  // COLLECTIONS PAGE BUTTONS
  const mainContent = document.getElementById("c-main-content");
  const cViewBtn = document.querySelectorAll('.c-view-na-btn');
  if(cViewBtn && mainContent){
    console.log("mainContent", mainContent);
  console.log("cViewBtn", cViewBtn);

    
    if (cViewBtn.length > 0) {
    console.log("Buttons found:", cViewBtn.length);
    cViewBtn.forEach(button => {
      button.addEventListener("click", () => {
        alert("Clicked!");
          console.log("buttonclick"); 
      mainContent.innerHTML = `<section>
          <h2>club kits 🔥</h2>
          <p> premier league, la liga and many more!</p>
        </section>
        <div class="c-item-group-1">
            <a href="samplekit.html" class="item-link">
            <div class="c-item-holder">
            <img src="images/ronaldo.png" alt="item1" width="200" height="200" />
            <h4>FC Barcelona Home '16-17</h4>
            </div>
            </a>
            <div class="c-item-holder">
                <img src="images/item2.jpg" alt="item1" width="200" height="200" />
            <h4>Manchester United Home '07-08</h4>
            </div>
            <div class="c-item-holder">
                <img src="images/item3.jpg" alt="item1" width="200" height="200" />
            <h4>Real Madrid Away '16-17</h4>
            </div>
        </div> 
        `;
      });
    });
  } else {
    console.error("No buttons with class 'c-view-na-btn' found");
  }


  }

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
  document.getElementById('search-button').addEventListener('click', function() {
    const searchInput = document.getElementById('search-bar').value;
    console.log('Search input:', searchInput);
    searchKits(searchInput);
  });


  function searchKits(searchInput) {
    if(searchInput != "search kits..."){
      fetch(`/api/search-kits?search=${encodeURIComponent(searchInput)}`)
      .then(response => response.json())
      .then(searchResults => {
        console.log('Search results:', searchResults);
        const searchResultsContainer = document.querySelector('.ak-item-group');
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

  



});






// ITEM PAGE
const dropdownLinks = document.querySelectorAll('.dropdown-content a');
const dropdownButton = document.getElementById('dropdownButton');


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
  // Update page elements with kit data based on the actual HTML structure
  const kitNameElement = document.querySelector('.kit-info h2');
  const kitPriceElement = document.querySelector('.kit-info h3');
  const kitImageElement = document.querySelector('.kit-header img');
  const kitDescriptionElement = document.querySelector('.kit-description p');
  
  if (kitNameElement) kitNameElement.textContent = kit.name;
  if (kitPriceElement) kitPriceElement.textContent = `$${kit.price}`;
  if (kitImageElement) kitImageElement.src = kit.image;
  if (kitDescriptionElement) kitDescriptionElement.textContent = kit.description;
  
  console.log('Kit details updated:', kit);
}

dropdownLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // Prevent link navigation
    const selected = this.getAttribute('data-value');
    dropdownButton.textContent = selected;
  });
});

akDropdownLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // Prevent link navigation
    const selected = this.getAttribute('data-value'); 
    akDropdownButton.textContent = selected;
  });
});

