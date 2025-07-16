export function fetchPlayerKits(){
    const playerName = getPlayerNameFromURL();

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
      <h4>$${kit.price}</h4>
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
}


function getPlayerNameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return decodeURIComponent(params.get('name') || '');
}