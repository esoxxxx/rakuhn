// Burger menu
  const burger = document.getElementById('burgerBtn');
  const drawer = document.getElementById('navDrawer');
  burger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });
  document.querySelectorAll('.nav-drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    });
  });


  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.product-card, .gift-card, .testi-card, .promise-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  const onClickProduct = (productname, price) => {
  
    const elem_form = document.getElementById('message');
    elem_form.value = `Hallo, ich interessiere mich für das Produkt "${productname}" zum Preis von ${price}. Könnten Sie mir bitte weitere Informationen zukommen lassen? Vielen Dank!`;

    const elem_subject = document.getElementById('subject');
    elem_subject.value = `Bestellanfrage: ${productname}`;

    elem_form.scrollIntoView({ behavior: 'smooth' });
  }


  document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit');
  const modal = document.getElementById('success-modal');
  

  const anfrageProdukt = sessionStorage.getItem('anfrage_produkt');
  if (anfrageProdukt && document.getElementById('message')) {
    const anfragePreis = sessionStorage.getItem('anfrage_preis') || '';
    onClickProduct(anfrageProdukt, anfragePreis);
    sessionStorage.removeItem('anfrage_produkt');
    sessionStorage.removeItem('anfrage_preis');
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Verhindert das Neuladen der Seite

      // Button-Text ändern, um Aktivität anzuzeigen
      const originalBtnText = submitBtn.innerText;
      submitBtn.innerText = "Wird gesendet...";
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      try {
        const response = await fetch('https://api.staticforms.xyz/submit', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (result.success) {
          // Formular leeren und Modal zeigen
          contactForm.reset();
          modal.style.display = 'flex';
        } else {
          alert("Fehler: " + result.message);
        }
      } catch (error) {
        alert("Es gab ein Problem beim Senden der Nachricht.");
      } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
});


// In deiner main.js ergänzen:
window.onclick = function(event) {
  const modal = document.getElementById('success-modal');
  if (event.target == modal) {
    closeModal();
  }
}

// Und die bekannte Schließen-Funktion
function closeModal() {
  document.getElementById('success-modal').style.display = 'none';
}