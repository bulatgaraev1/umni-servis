
jQuery(document).ready(function($) {

    
    var formMarkedShown = false;
    var savedMagnific = null;
    var isSavedState = false;

    // Автооткрытие при первом заходе
    if (typeof contactForm !== 'undefined' && !contactForm.alreadyShown) {
        openContactModal();
    }
    
    // Открытие по кнопке
    $(document).on('click', '.js-open-contact-form', function(e) {
        e.preventDefault();
        openContactModal();
    });

    $(document).on('click', '#modal-login-form .js-modal-dismiss, #form-submit.is-close-mode', function(e) {
        e.preventDefault();
        
        var escEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(escEvent);
        
        // Дублируем keyup на всякий случай
        var escEventUp = new KeyboardEvent('keyup', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(escEventUp);
    });
    
    $(document).on('input change', '#modal-login-form input', function() {
        var $input = $(this);
        $input.removeClass('input-error');
        $input.siblings('.input-error-text').remove();
        
        resetSaveButton();
    });

    $(document).on('change', '#modal-login-form .toggle2 input[type="checkbox"]', function() {
        var $checkbox = $(this);
        
        $checkbox.closest('.loginVariant').find('input')
            .removeClass('input-error')
            .siblings('.input-error-text').remove();
        
        if ($checkbox.is(':checked')) {
            resetSaveButton();
        }
    });

    $(document).on('click', '#form-submit', function(e) {
        if ($(this).hasClass('is-close-mode')) {
            e.preventDefault();
            if (savedMagnific) {
                savedMagnific.close();
            }
        }
    });

    function openContactModal() {
        if ( ! $('#modal-login-form').length ) return; 

        if ($.magnificPopup) {
            $.magnificPopup.open({
                items: {
                    src: '#modal-login-form',
                    type: 'inline'
                },
                closeOnBgClick: false,
                showCloseBtn:false,
                removalDelay: 150,
                midClick: true,
                callbacks: {
                    beforeOpen: function() {
                        this.st.mainClass = 'mfp-zoom-in';
                    },
                    close: function() {
                        resetSaveButton();
                        markFormAsShown();
                    }
                },
            });
        } else {
            $('#modal-login-form').show();
        }
    }
    
    // Отметка "форма показана"
    function markFormAsShown() {
        if (formMarkedShown) return;
        formMarkedShown = true;

        document.cookie = "contact_form_closed=1; path=/; SameSite=Lax";
    }

    function setCloseButton() {
        console.log('3');
        console.log('закрыть');
        isSavedState = true;
        $('#form-submit').addClass('is-close-mode').find('span').text('Закрыть');
    }

    function resetSaveButton() {
        if (!isSavedState) return;
        isSavedState = false;
        $('#form-submit').removeClass('is-close-mode').find('span').text('Сохранить');
    }

    function isPhoneFilled(value) {
        if (!value) return false;
        // Извлекаем только цифры
        var digits = value.replace(/\D/g, '');
        // Должно быть минимум 10 цифр (без учёта кода страны)
        // Для +7XXXXXXXXXX это 11 цифр, для +1XXXXXXXXXX тоже 11
        return digits.length >= 11;
    }
    
    // Отправка формы
    $('#form-submit').on('click', function(e) {
        e.preventDefault();
        
        var $btn = $(this);
        if ($btn.hasClass('is-close-mode')) return;
        if ($btn.hasClass('is-loading')) return;
        
        var emailEnabled = $('#t1').is(':checked');
        var tgEnabled    = $('#t2').is(':checked');
        var waEnabled    = $('#t3').is(':checked');
        var maxEnabled   = $('#t4').is(':checked');
        
        var emailVal = $.trim($('#modal-login-form input[type="email"]').val());
        var tgVal    = $.trim($('#modal-login-form .loginVariant').eq(1).find('input[type="text"]').val());
        var waVal    = waEnabled  ? getFullPhone('field-phone')  : '';
        var maxVal   = maxEnabled ? getFullPhone('field-phone2') : '';
        
        // Сбрасываем предыдущие подсветки
        $('#modal-login-form input').removeClass('input-error');
        $('#modal-login-form .input-error-text').remove();
        
        // Валидация: если тоггл включён, поле должно быть непустым
        var hasError = false;
        var $emailInput = $('#modal-login-form input[type="email"]');
        var $tgInput    = $('#modal-login-form .loginVariant').eq(1).find('input[type="text"]');
        var $waInput    = $('#field-phone');
        var $maxInput   = $('#field-phone2');
        
        if (emailEnabled) {
            console.log('emailEnabled');
            if (!emailVal) {
                showInlineError($emailInput, 'Введите email');
                hasError = true;
            } else if (!isValidEmail(emailVal)) {
                showInlineError($emailInput, 'Введите корректный email');
                hasError = true;
            }
        }

        console.log(emailEnabled);
        console.log(emailVal);

        if (tgEnabled && !tgVal) {
            $tgInput.addClass('input-error');
            hasError = true;
        }
        if (waEnabled && !isPhoneFilled(waVal)) {
            $waInput.addClass('input-error');
            hasError = true;
        }
        if (maxEnabled && !isPhoneFilled(maxVal)) {
            $maxInput.addClass('input-error');
            hasError = true;
        }
        
        if (hasError) {
            showMessage('Заполните выбранные поля', 'error');
            return;
        }
        
        // Если ничего не выбрано вообще — тоже не отправляем
        if (!emailEnabled && !tgEnabled && !waEnabled && !maxEnabled) {
            showMessage('Выберите хотя бы один канал связи', 'error');
            return;
        }

        var data = {
            action: 'save_contact_channels',
            nonce: contactForm.nonce,
            email_enabled: emailEnabled ? 1 : 0,
            email: emailEnabled ? emailVal : '',
            tg_enabled: tgEnabled ? 1 : 0,
            tg: tgEnabled ? tgVal : '',
            wa_enabled: waEnabled ? 1 : 0,
            wa: waEnabled ? waVal : '',
            max_enabled: maxEnabled ? 1 : 0,
            max: maxEnabled ? maxVal : ''
        };

        
        $btn.addClass('is-loading').find('span').text('Сохранение...');
        
        $.ajax({
            url: contactForm.ajaxurl,
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showMessage(response.data.message || 'Сохранено', 'success');
                    console.log('1');
                    formMarkedShown = true;
                    contactForm.alreadyShown = true;
                    
                    $btn.removeClass('is-loading');
                    console.log('2');
                    setCloseButton();
                    console.log('4');
                } else {
                    showMessage(response.data.message || 'Ошибка сохранения', 'error');
                    $btn.removeClass('is-loading').find('span').text('Сохранить');
                }
            },
            error: function() {
                showMessage('Ошибка соединения с сервером', 'error');
                $btn.removeClass('is-loading').find('span').text('Сохранить');
            }
        });
    });
    
    function showMessage(text, type) {
        var $msg = $('#modal-login-form .form-message');
        if (!$msg.length) {
            $msg = $('<div class="form-message"></div>').insertBefore('#form-submit');
        }
        $msg.removeClass('success error').addClass(type).text(text).show();
        setTimeout(function() { $msg.fadeOut(); }, 3000);
    }

    function showInlineError($input, text) {
        $input.addClass('input-error');
        $input.siblings('.input-error-text').remove();
        $input.after('<div class="input-error-text">' + text + '</div>');
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }

    function getFullPhone(inputId) {
        var $input = $('#' + inputId);
        
        if (window.intlTelInputGlobals) {
            try {
                var iti = window.intlTelInputGlobals.getInstance($input[0]);
                if (iti && iti.getNumber()) {
                    return iti.getNumber();
                }
            } catch(e) {}
        }
        
        var hiddenId = inputId === 'field-phone' ? 'field-phone-full' : 'field-phone-full2';
        var hiddenVal = $('#' + hiddenId).val();
        if (hiddenVal) {
            return $.trim(hiddenVal);
        }
        
        var $wrapper = $input.closest('.iti, .intl-tel-input');
        var dialCode = $wrapper.find('.iti__selected-dial-code, .selected-dial-code').text().trim();
        var number = $.trim($input.val());
        
        if (dialCode) {
            return dialCode + ' ' + number;
        }
        
        return number;
    }


});

