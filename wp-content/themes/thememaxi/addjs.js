jQuery(document).ready(function($) {

    function updateQuantitySelectorState(currentRequests) {
        const $quantityBoxes = $('#quantity-selector .box');
    
        $quantityBoxes.removeClass('is-disabled');

        if (currentRequests > 0) {

            $quantityBoxes.each(function() {
                const $box = $(this);
                const boxRequests = parseInt($box.data('val1'), 10);
                
                if (boxRequests < currentRequests) {
                    $box.addClass('is-disabled');
                }
            });


            const $activeBox = $('#quantity-selector .box.act');
            if ($activeBox.hasClass('is-disabled')) {
                $('#quantity-selector .box:not(.is-disabled)').first().addClass('act');
                $activeBox.removeClass('act');
            }
        }
        
        updateTariffPrice();
    }


    function checkProjectForUpgrade(projectId) {
        if (!projectId || projectId === '0') {
            updateQuantitySelectorState(0);
            return;
        }
        
        const data = {
            action: 'get_project_tariff_details',
            project_id: projectId
        };

        $.post(ajax_object.ajax_url, data, function(response) {
            if (response.success) {
                updateQuantitySelectorState(response.data.current_requests);
            } else {
                updateQuantitySelectorState(0);
            }
        });
    }

    function updateTariffPrice() {
        const quantity = $('#quantity-selector .box.act').data('val1');
        const periodId = $('#period-selector .box.act').data('period-id');
        const promoCode = $('#promo-code-input').val().trim();
        const promoForm = $('#promo-form');
        const projectId = $('#rateSelectProject').val();

        $('#final-price').text('Считаем...');
        var $button = $('#payment-button');
        $button.prop('disabled', true).html('<span class="loader_add_project"></span>');
        
        const data = {
            action: 'calculate_tariff',
            quantity: quantity,
            period_id: periodId,
            promo_code: promoCode,
            project_id: projectId
        };

        $.post(ajax_object.ajax_url, data, function(response) {
            if (response.success) {
                const results = response.data;
                $button.prop('disabled', false).html('<span class="rates-payment-text"></span>');

                $('#requests-count').text(results.quantity);
                $('#final-price').text(results.final_price_formatted);

                let paymentButtonText = '';
                console.log(results.project_id);
                
                if(results.project_id == 0){
                    $('#payment-button span.rates-payment-text').html('Выберите проект из списка');
                    $button.prop('disabled', true);
                } else {
                    let paymentButtonText = `Оплатить ${results.final_price_formatted}`;
                    $button.prop('disabled', false);
                    if (results.period_discount_percent > 0) {
                        paymentButtonText += ` <s>${results.base_price_formatted}</s>`;
                    }
                    $('#payment-button span.rates-payment-text').html(paymentButtonText);
                }

                
                $('#hid1').val(results.quantity);
                $('#hid2').val(results.period_str);
                $('#hid3').val(results.sale_str);

                promoForm.removeClass('success has-error'); // Сбрасываем классы
                
                if (results.promo_status === 'valid') {
                    promoForm.addClass('success');
                    $('#promo-discount').text(results.promo_discount_formatted);
                    //$('.promo-line').show();
                } else if (results.promo_status === 'invalid') {
                    promoForm.addClass('has-error');
                    $('#promo-discount').text('0 ₽');
                    $('.promo-line').hide();
                } else { // 'empty'
                    $('#promo-discount').text('0 ₽');
                    $('.promo-line').hide();
                }

                const $upgradeLine = $('.upgrade-discount-line');
    
                if (results.upgrade_discount > 0) {
                    $('#upgrade-discount').text(results.upgrade_discount_formatted);
                    $upgradeLine.show();
                } else {
                    $upgradeLine.hide();
                }

            } else {
                $button.prop('disabled', false).html('<span class="rates-payment-text"></span>');
                Toastify({
                          text: "Произошла ошибка. Свяжитесь с менеджером.",
                          duration: 4000,
                          position: "center",
                          style: {
                            background: "linear-gradient(to right, #e8282c, #f33d41)",
                          },
                        }).showToast();
            }
        });
    }


    $('#quantity-selector .box').on('click', function() {
        console.log('click');
        $(this).addClass('act').siblings().removeClass('act');
        updateTariffPrice();
    });


    $('#period-selector .box').on('click', function() {
        console.log('click');
        $(this).addClass('act').siblings().removeClass('act');
        updateTariffPrice();
    });

    $('#apply-promo-code').on('click', function() {
        updateTariffPrice();
    });

    //  $('#rateSelectProject').on('change', function(e) {
    //     e.preventDefault(); // Предотвращаем отправку формы
    //     updateTariffPrice();
    // });

     $('#rateSelectProject').on('change', function() {
        const projectId = $(this).val();
        checkProjectForUpgrade(projectId);
    });


    if ($('#popup-rates').length) {
         updateTariffPrice();
    }

    $('#promo-code-input').on('keydown', function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#apply-promo-code').trigger('click');
        }
    });
});

$( ".tooltip" ).hover(
        function() {
            $('body').prepend('<span class="tooltip-content">'+ $(this).data("title") +'</span>');

            let top = $(this).offset().top - ($(this).height() / 2);
            let left = $(this).offset().left;
            $('.tooltip-content').css({
                top: top + 'px',
                left: (left - 10) + 'px'
            }).addClass('active');
        }, function() {
            $('.tooltip-content').removeClass('active');
            $('.tooltip-content').remove();
        }
    );
        

    $(document).on('click', '.account__request--item', function(e) {
        $(this).toggleClass('active');
    });

    $(document).on('click', '#add-request2', function(e) {
        var text = $('#keywords').val().trim(); 
        var textLines = text ? text.split('\n') : []; 
        let arr = '';

        // Собираем текст из активных элементов
        $('.account__request--item.active').each(function() {
            let requestName = $(this).find('.request__name').text().trim();
            if (!textLines.includes(requestName)) {
                arr += requestName + '\n';
            }
        });

        if (arr) {
            $('#keywords').val(text + (text ? '\n' : '') + arr);
        }

        $('#keywords').focus().val($('#keywords').val());
        $('.account__request--item').removeClass('active');
        updateLineCount();
    });
        
    $(document).on('click', '#add-request', function(e) {
        var text = $('#keywords').val().trim(); 
        var textLines = text ? text.split('\n') : []; 
        let arr = '';


        $('.account__request--item').each(function() {
            $(this).addClass('active');
            let requestName = $(this).find('.request__name').text().trim();
            if (!textLines.includes(requestName)) {
                arr += requestName + '\n';
            }
        });

        if (arr) {
            $('#keywords').val(text + (text ? '\n' : '') + arr);
        }

        $('#keywords').focus().val($('#keywords').val());
        $('.account__request--item').removeClass('active');
        updateLineCount();
    });

    function declineRequests(count) {
        if (count % 10 === 1 && count % 100 !== 11) {
            return count + ' запрос';
        } else if (
            count % 10 >= 2 &&
            count % 10 <= 4 &&
            (count % 100 < 10 || count % 100 > 20)
        ) {
            return count + ' запроса';
        } else {
            return count + ' запросов';
        }
    }

    function updateLineCount() {
        if ($('#keywords').length && $('#line-count').length) {
            var text = $('#keywords').val();
            var lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
            var uniqueLines = [...new Set(lines)];
            var lineCount = uniqueLines.length;
            $('#line-count').html(declineRequests(lineCount));
        }
    }
updateLineCount();

    $('#keywords').on('input', function() {
        updateLineCount();
    });



    if ($(window).width() < 990) {
        $(document).on('click', '#add-request, #add-request2', function(e) {
            $('html, body').animate({
                scrollTop: $('#keywords').offset().top - 120
            }, 350)
        });
    }

    const inputs = document.getElementById("inputs");

inputs.addEventListener("input", function (e) {
    const target = e.target;
    const val = target.value;

    if (isNaN(val)) {
        target.value = "";
        return;
    }

    if (val != "") {
        const next = target.nextElementSibling;
        if (next) {
            next.focus();
        }
    }
});

inputs.addEventListener("keyup", function (e) {
    const target = e.target;
    const key = e.key.toLowerCase();

    if (key == "backspace" || key == "delete") {
        target.value = "";
        const prev = target.previousElementSibling;
        if (prev) {
            prev.focus();
        }
        return;
    }
});

function number_format( number, decimals, dec_point, thousands_sep ) {  // Format a number with grouped thousands
    // 
    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +     bugfix by: Michael White (http://crestidg.com)

    var i, j, kw, kd, km;

    // input sanitation & defaults
    if( isNaN(decimals = Math.abs(decimals)) ){
        decimals = 2;
    }
    if( dec_point == undefined ){
        dec_point = ",";
    }
    if( thousands_sep == undefined ){
        thousands_sep = ".";
    }

    i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

    if( (j = i.length) > 3 ){
        j = j % 3;
    } else{
        j = 0;
    }

    km = (j ? i.substr(0, j) + thousands_sep : "");
    kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
    //kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
    kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");


    return km + kw + kd;
}


// function getUrlParams() {
//     const params = new URLSearchParams(window.location.search);
//     const utmParams = {
//         utm_source: params.get('utm_source'),
//         utm_medium: params.get('utm_medium'),
//         utm_campaign: params.get('utm_campaign'),
//         utm_term: params.get('utm_term'),
//         utm_content: params.get('utm_content')
//     };
//     return utmParams;
// }


// function saveUtmToCookies() {
//     const utmParams = getUrlParams();
//     Object.keys(utmParams).forEach(key => {
//         if (utmParams[key]) {
//             document.cookie = `${key}=${utmParams[key]}; path=/; max-age=2592000`; // куки сохраняются на 30 дней
//         }
//     });
// }


// saveUtmToCookies();

