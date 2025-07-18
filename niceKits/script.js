import { showHomeSlides } from "./modules/slide.js";
import { initCollectionSlider, collect } from "./modules/collection.js";
import { fetchHotSelections } from "./modules/hot.js";
import { fetchNewArrivals } from "./modules/newarrival.js";
import { fetchPlayerKits } from "./modules/player.js";
import { allKits } from "./modules/all.js";
import { fetchCart } from "./modules/cart.js";
console.log('✅ SCRIPT.JS LOADED');
document.addEventListener("DOMContentLoaded", () => {

  console.log('✅ DOMContentLoaded started');
  showHomeSlides();

  console.log('✅Collections')
  initCollectionSlider();
  collect();

  console.log('✅Hot selections');
  fetchHotSelections();
  
  console.log('✅ New arrivals');
  fetchNewArrivals();

  console.log('✅ Player kits');
  fetchPlayerKits();

  console.log('✅ All kits');
  allKits();

  console.log('✅ Cart');
  fetchCart();
  // MODULE: KITINFO
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
});


// MODULE: KITINFO
// ITEM PAGE
const dropdownLinks = document.querySelectorAll('.dropdown-content a');
const dropdownButton = document.getElementById('dropdownButton');

const dropdownLinksB = document.querySelectorAll('.dropdown-content-b a');
const dropdownButtonB = document.getElementById('dropdownButton-b');
const dropdownContentB = document.querySelector('.dropdown-content-b');

// Function to get ID from URL
function getItemIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Example usage:

// MODULE: KITINFO
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

dropdownContentB.addEventListener('click', function(e) {
  if(e.target.matches('a[data-value]')){
    e.preventDefault();
    const selected = e.target.getAttribute('data-value');
    console.log('Selected addon:', selected);
    dropdownButtonB.textContent = selected;
  }
});




