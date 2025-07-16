 export function fetchHotSelections(){
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
      <h4>$${kit.price}</h4>
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
 }
 