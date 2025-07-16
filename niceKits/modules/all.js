export function allKits(){

const akDropdownButton = document.getElementById('ak-dropdownButton');
const akDropdownContent = document.querySelector('.ak-dropdown-content');
const akDropdownLinks = document.querySelectorAll('.ak-dropdown-content a');

akDropdownLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // Prevent link navigation
    const selected = this.getAttribute('data-value'); 
    akDropdownButton.textContent = selected;
  });
});


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
          <h4>$${kit.price}</h4>
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
          <h4>$${kit.price}</h4>
          </div>
          `;
          allKitsContainer.appendChild(link);
        });
      })
      .catch(error => {
        console.error('Error fetching all kits:', error);   
      });
  }

}




  

    