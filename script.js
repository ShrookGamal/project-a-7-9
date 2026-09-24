(function(){
  var header = document.getElementById('siteHeader');
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var drawer = document.getElementById('mobileDrawer');
  var drawerBackdrop = document.getElementById('drawerBackdrop');
  var drawerCloseBtn = document.getElementById('drawerCloseBtn');
  var navList = document.getElementById('navList');
  var navIndicator = document.getElementById('navIndicator');
  var scrollCue = document.getElementById('scrollCue');
  var heroParticles = document.getElementById('heroParticles');
  var body = document.body;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onScroll(){
    if(window.scrollY > 40){
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  document.addEventListener('scroll', function(){
    window.requestAnimationFrame(onScroll);
  }, { passive:true });
  onScroll();

  function openDrawer(){
    drawer.classList.add('is-open');
    drawerBackdrop.classList.add('is-visible');
    hamburgerBtn.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded','true');
    drawer.setAttribute('aria-hidden','false');
    body.classList.add('no-scroll');
  }

  function closeDrawer(){
    drawer.classList.remove('is-open');
    drawerBackdrop.classList.remove('is-visible');
    hamburgerBtn.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded','false');
    drawer.setAttribute('aria-hidden','true');
    body.classList.remove('no-scroll');
  }

  hamburgerBtn.addEventListener('click', function(){
    if(drawer.classList.contains('is-open')){
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerCloseBtn.addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && drawer.classList.contains('is-open')){
      closeDrawer();
    }
  });

  var drawerLinks = document.querySelectorAll('.drawer-link');
  drawerLinks.forEach(function(link){
    link.addEventListener('click', closeDrawer);
  });

  function moveIndicator(link){
    if(!link || !navIndicator || !navList) return;
    var listRect = navList.getBoundingClientRect();
    var linkRect = link.getBoundingClientRect();
    navIndicator.style.width = linkRect.width + 'px';
    navIndicator.style.right = (listRect.right - linkRect.right) + 'px';
    navIndicator.classList.add('is-visible');
  }

  var desktopNavLinks = document.querySelectorAll('.nav-link');
  var allNavLinks = document.querySelectorAll('[data-nav]');

  function setActiveLink(id){
    desktopNavLinks.forEach(function(link){
      var isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', isActive);
      if(isActive) moveIndicator(link);
    });
    drawerLinks.forEach(function(link){
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
    });
  }

  var sections = [];
  allNavLinks.forEach(function(link){
    var href = link.getAttribute('href');
    if(href && href.indexOf('#') === 0){
      var target = document.querySelector(href);
      if(target && sections.indexOf(target) === -1){
        sections.push(target);
      }
    }
  });

  if('IntersectionObserver' in window && sections.length){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          setActiveLink(entry.target.id);
        }
      });
    }, { rootMargin:'-45% 0px -50% 0px', threshold:0 });
    sections.forEach(function(section){ observer.observe(section); });
  }

  allNavLinks.forEach(function(link){
    link.addEventListener('click', function(e){
      var href = link.getAttribute('href');
      if(href && href.indexOf('#') === 0){
        var target = document.querySelector(href);
        if(target){
          e.preventDefault();
          closeDrawer();
          target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
          history.pushState(null, '', href);
          setActiveLink(target.id);
        }
      }
    });
  });

  var homeLink = document.querySelector('.nav-link[href="#home"]');
  if(homeLink) moveIndicator(homeLink);

  window.addEventListener('resize', function(){
    var activeLink = document.querySelector('.nav-link.is-active');
    if(activeLink) moveIndicator(activeLink);
  });

  if(scrollCue){
    scrollCue.addEventListener('click', function(){
      window.scrollTo({ top: window.innerHeight * 0.92, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  if(heroParticles && !reducedMotion){
    var particleCount = window.innerWidth < 700 ? 10 : 22;
    for(var i = 0; i < particleCount; i++){
      var particle = document.createElement('span');
      particle.className = 'hero-particle';
      var left = Math.random() * 100;
      var duration = 10 + Math.random() * 12;
      var delay = Math.random() * 14;
      var size = 3 + Math.random() * 4;
      particle.style.left = left + '%';
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.animationDuration = duration + 's';
      particle.style.animationDelay = delay + 's';
      heroParticles.appendChild(particle);
    }
  }

  if(!reducedMotion && window.matchMedia('(pointer: fine)').matches){
    var floatCards = document.querySelectorAll('[data-parallax]');
    var ticking = false;
    var mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e){
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
      if(!ticking){
        window.requestAnimationFrame(function(){
          floatCards.forEach(function(card){
            var strength = parseFloat(card.getAttribute('data-parallax')) || 10;
            card.style.marginLeft = (mouseX * strength) + 'px';
            card.style.marginTop = (mouseY * strength * 0.6) + 'px';
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  window.addEventListener('load', function(){
    body.classList.add('is-loaded');
  });
  (function(){
  var aboutSection = document.getElementById('about');
  if(!aboutSection) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = aboutSection.querySelectorAll('[data-ab-reveal]');
  items.forEach(function(el, i){
    el.style.setProperty('--ab-delay', (i % 6) * 0.08 + 's');
  });
  function runCounter(el){
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if(reduced){ el.textContent = target; return; }
    var duration = 1600;
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if(p < 1){ requestAnimationFrame(step); } else { el.textContent = target; }
    }
    requestAnimationFrame(step);
  }

  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-in');
        el.querySelectorAll('[data-count]').forEach(runCounter);
        io.unobserve(el);
      });
    }, { threshold:0.18, rootMargin:'0px 0px -6% 0px' });
    items.forEach(function(el){ io.observe(el); });
  } else {
    items.forEach(function(el){
      el.classList.add('is-in');
      el.querySelectorAll('[data-count]').forEach(runCounter);
    });
  }
  var frame = document.getElementById('aboutFrame');
  if(frame && !reduced && window.matchMedia('(pointer: fine)').matches){
    var media = frame.parentElement;
    media.addEventListener('mousemove', function(e){
      var r = media.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      frame.style.transform = 'perspective(900px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 5) + 'deg)';
    });
    media.addEventListener('mouseleave', function(){
      frame.style.transform = '';
    });
  }
})();
(function(){
  var section = document.getElementById('services');
  if(!section) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PHONE = '966563894239';
  section.querySelectorAll('.svc-cta[data-wa]').forEach(function(btn){
    var name = btn.getAttribute('data-wa');
    var msg = 'السلام عليكم، أريد الاستفسار عن خدمة: ' + name;
    btn.href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
    btn.target = '_blank';
    btn.rel = 'noopener';
  });
  var items = section.querySelectorAll('[data-sv-reveal]');
  if(reduced || !('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold:0.15, rootMargin:'0px 0px -6% 0px' });
    items.forEach(function(el, i){
      el.style.transitionDelay = (el.classList.contains('svc-body') ? 0.12 : 0) + 's';
      io.observe(el);
    });
  }
  section.querySelectorAll('.svc-chips a').forEach(function(a){
    a.addEventListener('click', function(e){
      var target = document.querySelector(a.getAttribute('href'));
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block:'start' });
    });
  });
})();
(function(){
  var section = document.getElementById('portfolio');
  if(!section) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var grid = document.getElementById('pfGrid');
  var items = Array.prototype.slice.call(grid.querySelectorAll('.pf-item'));
  var filterBtns = section.querySelectorAll('.pf-filter');
  var revealEls = section.querySelectorAll('[data-pf-reveal]');
  if(reduced || !('IntersectionObserver' in window)){
    revealEls.forEach(function(el){ el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold:0.15 });
    revealEls.forEach(function(el){ io.observe(el); });
  }
  function updateCounts(){
    var counts = { all: items.length, image: 0, video: 0 };
    items.forEach(function(it){ counts[it.getAttribute('data-type')]++; });
    Object.keys(counts).forEach(function(k){
      var el = section.querySelector('[data-count-for="' + k + '"]');
      if(el) el.textContent = counts[k];
    });
  }
  updateCounts();
  function pauseAllVideos(exceptEl){
    grid.querySelectorAll('video').forEach(function(v){
      if(v !== exceptEl && !v.paused) v.pause();
    });
  }
  grid.querySelectorAll('video').forEach(function(v){
    v.addEventListener('play', function(){ pauseAllVideos(v); });
  });
  function applyFilter(type){
    pauseAllVideos(null);
    items.forEach(function(it, i){
      var match = (type === 'all') || it.getAttribute('data-type') === type;
      it.classList.toggle('is-hidden', !match);
      if(match && !reduced){
        it.style.animation = 'none';
        void it.offsetWidth; 
        it.style.animation = '';
        it.style.animationDelay = (i % 6) * 0.06 + 's';
      }
    });
  }

  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      filterBtns.forEach(function(b){
        b.classList.remove('is-active');
        b.setAttribute('aria-selected','false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected','true');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });
  var lb = document.getElementById('pfLightbox');
  var lbImg = document.getElementById('pfLbImg');
  var lbClose = document.getElementById('pfLbClose');
  var lbNext = document.getElementById('pfLbNext');
  var lbPrev = document.getElementById('pfLbPrev');
  var lbList = [];
  var lbIndex = 0;

  function visibleImages(){
    return items
      .filter(function(it){
        return it.getAttribute('data-type') === 'image' && !it.classList.contains('is-hidden');
      })
      .map(function(it){ return it.querySelector('img'); })
      .filter(function(img){ return img && img.style.display !== 'none'; });
  }

  function showImage(i){
    if(!lbList.length) return;
    lbIndex = (i + lbList.length) % lbList.length;
    lbImg.src = lbList[lbIndex].currentSrc || lbList[lbIndex].src;
    lbImg.alt = lbList[lbIndex].alt || '';
  }

  function openLightbox(img){
    lbList = visibleImages();
    var idx = lbList.indexOf(img);
    if(idx === -1) return;
    showImage(idx);
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden','false');
    document.body.classList.add('no-scroll');
    var single = lbList.length < 2;
    lbNext.style.display = lbPrev.style.display = single ? 'none' : '';
  }

  function closeLightbox(){
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden','true');
    document.body.classList.remove('no-scroll');
  }

  grid.addEventListener('click', function(e){
    var img = e.target.closest('.pf-media img');
    if(img) openLightbox(img);
  });

  lbClose.addEventListener('click', closeLightbox);
  lbNext.addEventListener('click', function(){ showImage(lbIndex + 1); });
  lbPrev.addEventListener('click', function(){ showImage(lbIndex - 1); });
  lb.addEventListener('click', function(e){
    if(e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('is-open')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowLeft') showImage(lbIndex + 1);
    if(e.key === 'ArrowRight') showImage(lbIndex - 1);
  });
})();
(function(){
  var section = document.getElementById('faq');
  if(!section) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = Array.prototype.slice.call(section.querySelectorAll('.faq-item'));
  function setOpen(item, open){
    var btn = item.querySelector('.faq-q');
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  items.forEach(function(item){
    var btn = item.querySelector('.faq-q');
    btn.addEventListener('click', function(){
      var willOpen = !item.classList.contains('is-open');
      items.forEach(function(other){
        if(other !== item) setOpen(other, false);
      });
      setOpen(item, willOpen);
    });
  });

  /* التنقل بالأسهم في الكيبورد بين الأسئلة */
  section.addEventListener('keydown', function(e){
    var btn = e.target.closest('.faq-q');
    if(!btn) return;
    var btns = items.map(function(it){ return it.querySelector('.faq-q'); });
    var i = btns.indexOf(btn);
    if(e.key === 'ArrowDown'){ e.preventDefault(); btns[(i + 1) % btns.length].focus(); }
    if(e.key === 'ArrowUp'){ e.preventDefault(); btns[(i - 1 + btns.length) % btns.length].focus(); }
    if(e.key === 'Home'){ e.preventDefault(); btns[0].focus(); }
    if(e.key === 'End'){ e.preventDefault(); btns[btns.length - 1].focus(); }
  });

  /* ظهور العناصر بالتتابع عند التمرير */
  var revealEls = section.querySelectorAll('[data-fq-reveal]');
  if(reduced || !('IntersectionObserver' in window)){
    revealEls.forEach(function(el){ el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold:0.12, rootMargin:'0px 0px -5% 0px' });
    revealEls.forEach(function(el, i){
      el.style.transitionDelay = (i % 4) * 0.07 + 's';
      io.observe(el);
    });
  }
})();
(function(){
  var section = document.getElementById('blog');
  if(!section) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = section.querySelectorAll('[data-bl-reveal]');

  if(reduced || !('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold:0.15, rootMargin:'0px 0px -6% 0px' });

  items.forEach(function(el, i){
    el.style.transitionDelay = (el.classList.contains('blog-card') ? (i % 3) * 0.12 : 0) + 's';
    io.observe(el);
  });
})();
(function(){
  var section = document.getElementById('testimonials');
  if(!section) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = section.querySelectorAll('[data-tm-reveal]');

  if(reduced || !('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold:0.15, rootMargin:'0px 0px -6% 0px' });

  items.forEach(function(el, i){
    el.style.transitionDelay = (el.classList.contains('tm-card') ? (i % 4) * 0.09 : 0) + 's';
    io.observe(el);
  });
})();
(function(){
  var section = document.getElementById('why-us');
  if(!section) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = section.querySelectorAll('[data-wh-reveal]');
  var timeline = document.getElementById('whyTimeline');
  var lineFill = document.getElementById('whyLineFill');

  if(reduced || !('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold:0.15, rootMargin:'0px 0px -6% 0px' });
    items.forEach(function(el, i){
      el.style.transitionDelay = (el.classList.contains('why-item') ? (i % 6) * 0.08 : 0) + 's';
      io.observe(el);
    });
  }

  function updateLine(){
    var rect = timeline.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = rect.height;
    var visible = vh * 0.75 - rect.top;
    var pct = Math.max(0, Math.min(1, visible / total));
    lineFill.style.height = (pct * 100) + '%';
  }

  if(reduced){
    lineFill.style.height = '100%';
  } else {
    document.addEventListener('scroll', function(){
      window.requestAnimationFrame(updateLine);
    }, { passive:true });
    updateLine();
  }
})();
(function(){
  var section = document.getElementById('contact');
  if(!section) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = section.querySelectorAll('[data-ct-reveal]');

  if(reduced || !('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold:0.15, rootMargin:'0px 0px -6% 0px' });

  items.forEach(function(el, i){
    el.style.transitionDelay = (el.classList.contains('ct-card') ? i * 0.12 : 0) + 's';
    io.observe(el);
  });
})();
(function(){
  var yearEl = document.getElementById('footerYear');
  if(yearEl){
    yearEl.textContent = new Date().getFullYear();
  }
})();
})();