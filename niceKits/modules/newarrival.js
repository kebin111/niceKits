export function fetchNewArrivals(){
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
      <h4>$${kit.price}</h4>
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

}
