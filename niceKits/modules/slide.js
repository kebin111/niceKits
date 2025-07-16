function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) slide.classList.add('active');
    });
  }
  
export function showHomeSlides(){
    let currentSlide = 0;
    const intervalTime = 5000;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

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
}
  