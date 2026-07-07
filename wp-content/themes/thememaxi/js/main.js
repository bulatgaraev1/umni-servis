window.addEventListener('DOMContentLoaded', () => {
  // * ===== Mask input
  $('input[type="tel"]').mask('+7 (999) 999-99-99');

  // * ===== Nice Select
  // $('select').niceSelect();

  // * ===== resizableSwiper

  (function () {
    const resizableSwiper = (
      breakpoint,
      swiperClass,
      swiperSettings,
      callback
    ) => {
      let swiper;

      breakpoint = window.matchMedia(breakpoint);

      const enableSwiper = function (className, settings) {
        swiper = new Swiper(className, settings);

        if (callback) {
          callback(swiper);
        }
      };

      const checker = function () {
        if (breakpoint.matches) {
          return enableSwiper(swiperClass, swiperSettings);
        } else {
          if (swiper !== undefined) swiper.destroy(true, true);
          return;
        }
      };

      breakpoint.addEventListener('change', checker);
      checker();
    };

    const someFunc = (instance) => {
      if (instance) {
        instance.on('slideChange', function (e) {
          console.log('*** mySwiper.activeIndex', instance.activeIndex);
        });
      }
    };

    resizableSwiper('(max-width: 991px)', '.faq__slider', {
      pagination: {
        el: '.swiper-pagination',
      },
      breakpoints: {
        280: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        450: {
          slidesPerView: 'auto',
          spaceBetween: 10,
        },
      },
    });

    resizableSwiper('(max-width: 991px)', '.steps__slider', {
      breakpoints: {
        280: {
          slidesPerView: 'auto',
          spaceBetween: 18,
        },
      },
    });

    resizableSwiper('(max-width: 991px)', '.service__slider', {
      pagination: {
        el: '.swiper-pagination',
      },
      breakpoints: {
        280: {
          slidesPerView: 'auto',
          spaceBetween: 20,
        },
        767: {
          slidesPerView: 1.3,
          spaceBetween: 20,
        },
      },
    });
  })();

  // * ===== Slider
  (function slider() {
    const sliderEl = document.querySelector('.rates__slider');
    new Swiper(sliderEl, {
      slidesPerView: 'auto',
      spaceBetween: 18,
    });
  
  const sliderE2 = document.querySelector('.news-slider');
  new Swiper(sliderE2, {
      slidesPerView: 3,
      spaceBetween: 20,
    navigation: {
        nextEl: ".news-slider-next",
        prevEl: ".news-slider-prev",
      },
      pagination: {
          el: '.swiper-pagination',
          clickable: true,
      },
    breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 0,
      autoplay: {
      delay: 3000,
      pauseOnMouseEnter: true,
      },
        },
    560: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20,
        }
      },
    });


  const sliderE3 = document.querySelector('.news-slider-test');
  new Swiper(sliderE3, {
      slidesPerView: 3,
      spaceBetween: 20,
    navigation: {
        nextEl: ".news-slider-next",
        prevEl: ".news-slider-prev",
      },
      pagination: {
          el: '.swiper-pagination',
          clickable: true,
      },
    breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 0,
      autoplay: {
      delay: 3000,
      pauseOnMouseEnter: true,
      },
        },
    560: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20,
        }
      },
    });
  
  })();

  

  // pagination: {
  //   el: '.swiper-pagination',
  // },
  // navigation: {
  //   nextEl: '.works__slider .swiper-button-next',
  //   prevEl: '.works__slider .swiper-button-prev',
  // },

  // * ===== Modal
  (function modals() {
    function bindModal(openBtn, modal, close) {
      const openBtnEl = document.querySelectorAll(openBtn);
      const modalEl = document.querySelector(modal);
      const closeEl = document.querySelectorAll(close);
      const body = document.querySelector('body');
      if (modalEl) {
        openBtnEl.forEach((el) => {
          el.addEventListener('click', (e) => {
            if (e.target) {
              e.preventDefault();
            }
            modalEl.classList.add('active');
            body.classList.add('no-scroll');
          });
        });
        closeEl.forEach((btn) => {
          btn.addEventListener('click', (e) => {
            modalEl.classList.remove('active');
            body.classList.remove('no-scroll');
          });
        });
        modalEl.addEventListener('click', (e) => {
          if (e.target === modalEl) {
            modalEl.classList.remove('active');
            body.classList.remove('no-scroll');
          }
        });
      }
    }

    bindModal('.project_payment_btn', '.popup--createtarif', '.popup__close');
    bindModal('.header-rate__text', '.popup--tariffs', '.popup__close');
    bindModal('.header-rate__btn', '.popup--createtarif', '.popup__close');
    bindModal('.account-table-btn', '.popup--add', '.popup__close');
    bindModal('.delete-project-btn', '.popup--delete', '.popup__close');
    bindModal('.createtarif-btn', '.popup--createtarif', '.popup__close');
    bindModal('.buysemantic-btn', '.popup--buysemantic', '.popup__close');
    bindModal('.base-popup-btn', '.popup--base', '.popup__close');
    bindModal('.brief-btn', '.popup--brief', '.popup__close');
    bindModal('.project_update_btn', '.popup--updatetarif', '.popup__close');
    bindModal('.baza-order-btn', '.popup--baza_form', '.popup__close');
    bindModal('.banner-new', '.popup--new', '.popup__close');
    bindModal('[data-catmaps-open]', '.catmaps_addcard', '.popup__close');
    bindModal('[data-catmaps-rates-open]', '.catmaps_rates', '.popup__close');
  })();

  (function modalsData() {
    function bindModalData(openBtnSelector, modalSelector, closeSelector) {
      const openBtns = document.querySelectorAll(openBtnSelector);
      const body = document.querySelector('body');

      openBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const id = btn.dataset.id;
          const modal = document.querySelector(`${modalSelector}[data-id="${id}"]`);
          if (modal) {
            modal.classList.add('active');
            body.classList.add('no-scroll');

            // Закрытие по кнопке
            const closeBtns = modal.querySelectorAll(closeSelector);
            closeBtns.forEach((closeBtn) => {
              closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                body.classList.remove('no-scroll');
              });
            });

            // Закрытие по фону
            modal.addEventListener('click', (e) => {
              if (e.target === modal) {
                modal.classList.remove('active');
                body.classList.remove('no-scroll');
              }
            }, { once: true }); // навешиваем только один раз
          }
        });
      });
    }

    
  bindModalData('.base2-popup-btn', '.popup--base2', '.popup__close');
  })();

  //   // * ===== Toggle Tabs
  //   function someTabs(headerSelector, tabSelector, contentSelector, activeClass) {
  //     const header = document.querySelectorAll(headerSelector);
  //     const tab = document.querySelectorAll(tabSelector);
  //     const content = document.querySelectorAll(contentSelector);
  //     header.forEach((el) => {
  //       if (el) {
  //         hideTabContent();
  //         showTabContent();
  //         function hideTabContent() {
  //           content.forEach((item) => {
  //             item.classList.remove('active');
  //           });
  //           tab.forEach((item) => {
  //             item.classList.remove(activeClass);
  //           });
  //         }
  //         function showTabContent(i = 0) {
  //           content[i].classList.add('active');
  //           tab[i].classList.add(activeClass);
  //         }
  //         header.forEach((item) => {
  //           if (item) {
  //             item.addEventListener('click', (e) => {
  //               const target = e.target;
  //               if (target.classList.contains(tabSelector.replace(/\./, ''))) {
  //                 tab.forEach((item, i) => {
  //                   if (target == item || target.parentNode == item) {
  //                     hideTabContent();
  //                     showTabContent(i);
  //                   }
  //                 });
  //               }
  //             });
  //           }
  //         });
  //       }
  //     });
  //   }
  //   someTabs('.contacts', '.contacts-top__item', '.contacts__content', 'active');
  //   function toggleTabs(
  //     headerSelector,
  //     tabSelector,
  //     contentSelector,
  //     activeClass
  //   ) {
  //     const header = document.querySelectorAll(headerSelector);
  //     const tab = document.querySelectorAll(tabSelector);
  //     const content = document.querySelectorAll(contentSelector);
  //     header.forEach((el) => {
  //       if (el) {
  //         hideTabContent();
  //         showTabContent();
  //         function hideTabContent() {
  //           content.forEach((item) => {
  //             item.classList.remove('active');
  //           });
  //           tab.forEach((item) => {
  //             item.classList.remove(activeClass);
  //           });
  //         }
  //         function showTabContent(i = 4) {
  //           content[i].classList.add('active');
  //           tab[i].classList.add(activeClass);
  //         }
  //         header.forEach((item) => {
  //           if (item) {
  //             item.addEventListener('click', (e) => {
  //               const target = e.target;
  //               if (target.classList.contains(tabSelector.replace(/\./, ''))) {
  //                 tab.forEach((item, i) => {
  //                   if (target == item || target.parentNode == item) {
  //                     hideTabContent();
  //                     showTabContent(i);
  //                   }
  //                 });
  //               }
  //             });
  //           }
  //         });
  //       }
  //     });
  //   }
  //   toggleTabs(
  //     '.price-list',
  //     '.price-list-top__btn',
  //     '.price-list__content',
  //     'active'
  //   );
});
function getClosest(el, s) {
    var r = undefined;
    while (el) {
        if (el.matches(s)) {
           r = el;
           break;
        } else if (el.tagName.toLowerCase() == 'body') {
           break;
        }
        el = el.parentElement;
    }
    return r;
}

document.addEventListener('submit', function(e) {
    var form = getClosest(e.target, 'form');
    
    // Проверяем, что отправляется именно нужная форма
    if (form && form.querySelector('.addProject_app .form-account__btn--big')) {
        
        // 1. ОСТАНАВЛИВАЕМ отправку формы
        e.preventDefault(); 
        
        // Получаем значение сайта
        var siteInput = form.querySelector('.form-account__group input');
        var site = siteInput ? siteInput.value : '';
        var region = '';
        var select2Container = form.querySelector('[id^="select2-region-"]');
        
        if (select2Container) {
            region = select2Container.textContent || select2Container.innerText;
        } else {
            // Запасной вариант: если ID вдруг другой, ищем по общему классу Select2
            var generalSelect2 = form.querySelector('.select2-selection__rendered');
            if (generalSelect2) {
                region = generalSelect2.textContent || generalSelect2.innerText;
            }
        }
        if (region) { 
            region = region.trim(); 
        }

        console.log('=== ПРОВЕРКА ДАННЫХ ===');
        console.log('Сайт:', site);
        console.log('Регион:', region);
        console.log('=======================');

        carrotquest.track('Нажал на кнопку Добавить сайт в форме');
        
        carrotquest.identify([
           {op: 'update_or_create', key: 'Сайт', value: site},
           {op: 'update_or_create', key: '$region', value: region} 
        ]);
        
        // 3. Отправляем форму на сервер через 500 мс
        setTimeout(function() {
            form.submit();
        }, 500);
    }
});

document.addEventListener('mousedown', function(e) {
  console.log('down');
    // 1. Кнопка «Собрать семантику»
    if (e.target.closest('.account__row .btn-group a, .account__row .btn-group a *')) {
        carrotquest.track('Нажал на кнопку Собрать семантику');
    }
    
    // 2. Кнопка «Запустить в работу»
    else if (e.target.closest('.account__bottom--form button, .account__bottom--form button *')) {
        carrotquest.track('Нажал на кнопку Запустить в работу');
    }
    
    // 3. Кнопка «Добавить сайт»
    else if (e.target.closest('.account__btns button, .account__btns button *')) {
      console.log('add site');
        carrotquest.track('Нажал на кнопку Добавить сайт');
    }
});