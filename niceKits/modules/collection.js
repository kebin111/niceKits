export function initCollectionSlider(){
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
function fetchCollection(cButtonContent){
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
      <h4>$${kit.price}</h4>
      </div>
      `;
      c_itemGroup.appendChild(link);
    });
    })
    .catch(error => {
      console.error("Error fetching collections:", error);
    });
  }


  // COLLECTIONS PAGE BUTTONS
export function collect(){
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
}
 