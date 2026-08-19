// Burger menu
  const burger = document.getElementById('burgerBtn');
  const drawer = document.getElementById('navDrawer');
  burger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });
  document.querySelectorAll('.nav-drawer-link, .nav-drawer .social-icon').forEach(link => {
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

// ─── LIGHTBOX / BILDER-CAROUSSEL (Produkt- und Geschenkset-Seiten) ───
(() => {
  // Bildgruppen: die Galerie und die Bilder im Beschreibungstext werden
  // getrennt durchgeblaettert, damit man nicht aus dem Thema faellt.
  const gruppen = [];
  document.querySelectorAll('.gallery-grid').forEach(grid => {
    const imgs = Array.from(grid.querySelectorAll('.gallery-item img'));
    if (imgs.length) gruppen.push(imgs);
  });
  const textbilder = Array.from(document.querySelectorAll('.description-img'));
  if (textbilder.length) gruppen.push(textbilder);
  if (!gruppen.length) return;

  let bilder = [];          // aktuell geoeffnete Gruppe
  let aktuell = 0;
  let letzterAusloeser = null;

  // Overlay einmalig aufbauen
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Bildergalerie');
  box.innerHTML = `
    <button class="lightbox-btn lightbox-close" type="button" aria-label="Schließen">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </button>
    <button class="lightbox-btn lightbox-prev" type="button" aria-label="Vorheriges Bild">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m15 18-6-6 6-6"/>
      </svg>
    </button>
    <img class="lightbox-bild" alt="">
    <button class="lightbox-btn lightbox-next" type="button" aria-label="Nächstes Bild">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </button>
    <div class="lightbox-zaehler" aria-live="polite"></div>
  `;
  document.body.appendChild(box);

  const grossesBild = box.querySelector('.lightbox-bild');
  const zaehler = box.querySelector('.lightbox-zaehler');
  const btnPrev = box.querySelector('.lightbox-prev');
  const btnNext = box.querySelector('.lightbox-next');
  const btnClose = box.querySelector('.lightbox-close');

  const zeige = (index) => {
    aktuell = (index + bilder.length) % bilder.length;  // umlaufend
    const quelle = bilder[aktuell];
    grossesBild.src = quelle.src;
    grossesBild.alt = quelle.alt || '';
    zaehler.textContent = `${aktuell + 1} / ${bilder.length}`;
    // Nachbarbilder vorladen, damit das Blättern nicht ruckelt
    [aktuell - 1, aktuell + 1].forEach(i => {
      const nachbar = bilder[(i + bilder.length) % bilder.length];
      if (nachbar) new Image().src = nachbar.src;
    });
  };

  const oeffne = (gruppe, index, ausloeser) => {
    bilder = gruppe;
    box.classList.toggle('einzelbild', bilder.length === 1);
    letzterAusloeser = ausloeser || null;
    zeige(index);
    box.classList.add('open');
    document.body.classList.add('lightbox-offen');
    btnClose.focus();
  };

  const schliesse = () => {
    box.classList.remove('open');
    document.body.classList.remove('lightbox-offen');
    grossesBild.removeAttribute('src');
    if (letzterAusloeser) letzterAusloeser.focus();
  };

  // Alle Bilder klickbar und per Tastatur erreichbar machen
  gruppen.forEach(gruppe => {
    gruppe.forEach((img, i) => {
      const ziel = img.closest('.gallery-item') || img;   // Galeriekachel oder Bild im Text
      ziel.setAttribute('tabindex', '0');
      ziel.setAttribute('role', 'button');
      ziel.setAttribute('aria-label', `Bild ${i + 1} von ${gruppe.length} vergrößern`);
      ziel.addEventListener('click', () => oeffne(gruppe, i, ziel));
      ziel.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          oeffne(gruppe, i, ziel);
        }
      });
    });
  });

  btnPrev.addEventListener('click', () => zeige(aktuell - 1));
  btnNext.addEventListener('click', () => zeige(aktuell + 1));
  btnClose.addEventListener('click', schliesse);

  // Klick auf den Hintergrund schließt, Klick aufs Bild nicht
  box.addEventListener('click', (e) => {
    if (e.target === box) schliesse();
  });

  // Tastatursteuerung
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') schliesse();
    else if (e.key === 'ArrowLeft') zeige(aktuell - 1);
    else if (e.key === 'ArrowRight') zeige(aktuell + 1);
  });

  // Wischen auf Touchgeräten
  let startX = null;
  box.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const strecke = e.changedTouches[0].clientX - startX;
    if (Math.abs(strecke) > 50) zeige(strecke < 0 ? aktuell + 1 : aktuell - 1);
    startX = null;
  }, { passive: true });
})();
