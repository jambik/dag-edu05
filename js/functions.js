$(document).ready(function() {

    performSlideshow();

    $(window).bind('scroll', function () {
        if ($(window).scrollTop() > 300) {
            $('nav').addClass('fixed');
            $('#fixed-padding').show();
        } else {
            $('nav').removeClass('fixed');
            $('#fixed-padding').hide();
        }
    });

    if ($('#form_callback').length) {
        $('#form_callback').on('submit', function(e){
            ajaxFormSubmit(e, callbackSuccess);
        });
    }

    if ($('#form_calculation').length) {
        $('#form_calculation').on('submit', function(e){
            ajaxFormSubmit(e, calculationSuccess);
        });
    }

    $("#form_recall").submit(function() {

        // Место для отображения ошибок в форме
        var formStatus = $(this).find('.form-status');
        if (formStatus.length) {
            formStatus.html('');
        }

        // Анимированная кнопка при отправки формы
        var formButton = $(this).find('.form-button');
        if (formButton.length) {
            formButton.append(' <i class="fa fa-spinner fa-spin"></i>');
            formButton.prop('disabled', true);
        }

        var formData = new FormData($(this)[0]);
        var url = $(this).attr("action");

        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data)
            {
                $('#recallModal').modal('hide');
                showNoty(data.message, 'success');
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                if (formStatus.length && jqXHR.status == 422) // Если статус 422 (неправильные входные данные) то отображаем ошибки
                {
                    var formStatusText = "<div class='alert alert-danger'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><div class='text-uppercase'>" + (formStatus.data('errorText') ? formStatus.data('errorText') : 'Ошибка!') + "</div><ul>";

                    $.each(jqXHR.responseJSON, function (index, value) {
                        formStatusText += "<li>" + value + "</li>";
                    });

                    formStatusText += "</ul></div>";
                    formStatus.html(formStatusText);
                    $('body').scrollTo(formStatus, 500);
                }
                else
                {
                    sweetAlert("", "Ошибка при запросе к серсеру", 'error');
                }
            },
            complete: function (jqXHR, textStatus)
            {
                if (formButton.length)
                {
                    formButton.find('i').remove();
                    formButton.prop('disabled', false);
                }
            }
        });

        return false;
    });

    if ($('.gallery').length) {
        $('.gallery').magnificPopup({
            type: 'image',
            zoom: {
                enabled: true
            },
            gallery: {
                enabled: true,
                preload: [1, 2],
                tPrev: 'Пердыдущая (клавиша влево)',
                tNext: 'Следующая (клавиша вправо)'
            },
            tLoading: 'Загрузка...'
        });
    }

    if ($('.popup-product').length) {
        $('.popup-product').magnificPopup({
            type: 'image',
            zoom: {
                enabled: true
            },
            tLoading: 'Загрузка...'
        });
    }

    if ($('.ajax-popup').length) {
        $('.ajax-popup').magnificPopup({
            type: 'ajax',
            overflowY: 'scroll' // as we know that popup content is tall we set scroll overflow by default to avoid jump
        });
    }

});

function ajaxFormSubmit(e, successFunction)
{
    e.preventDefault();

    var form = e.target;

    // Место для отображения ошибок в форме
    var formStatus = $(form).find('.form-status');
    if (formStatus.length) {
        formStatus.html('');
    }

    // Анимированная кнопка при отправки формы
    var formButton = $(form).find('.form-button');
    if (formButton.length) {
        formButton.append(' <i class="fa fa-spinner fa-spin"></i>');
        formButton.prop('disabled', true);
    }

    $.ajax({
        method: $(form).attr('method'),
        url: $(form).attr('action'),
        data: $(form).serialize(),
        success: function (data)
        {
            successFunction(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            if (formStatus.length && jqXHR.status == 422) // Если статус 422 (неправильные входные данные) то отображаем ошибки
            {
                var formStatusText = "<div class='alert alert-danger'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><div class='text-uppercase'>" + (formStatus.data('errorText') ? formStatus.data('errorText') : 'Ошибка!') + "</div><ul>";

                $.each(jqXHR.responseJSON, function (index, value) {
                    formStatusText += "<li>" + value + "</li>";
                });

                formStatusText += "</ul></div>";
                formStatus.html(formStatusText);
                $('body').scrollTo(formStatus, 500);
            }
            else
            {
                sweetAlert("", "Ошибка при запросе к серсеру", 'error');
            }
        },
        complete: function (jqXHR, textStatus)
        {
            if (formButton.length)
            {
                formButton.find('i').remove();
                formButton.prop('disabled', false);
            }
        }
    });
}

function callbackSuccess(data)
{
    $('#callbackModal').modal('hide');
    showNoty(data.message, 'success');
}

function calculationSuccess(data)
{
    showNoty(data.message, 'success');
}

function showNoty(message, type)
{
    noty({
        text: message,
        type: type,
        layout: 'topCenter',
        theme: 'relax',
        timeout: 5000,
        animation: {
            open: 'animated flipInX', // jQuery animate function property object
            close: 'animated flipOutX', // jQuery animate function property object
            easing: 'swing', // easing
            speed: 500 // opening & closing animation speed
        }
    });
}

function performSlideshow()
{
    var $slides = $('[data-slides]');

    if ($slides.length) {
        var current = 0;
        var images = $slides.data('slides');
        var count = images.length;
        var timer;

        if (count > 1) {
            var slideshow = function (imageIndex) {
                if (current >= count - 1) {
                    current = 0;
                } else {
                    current++;
                }

                if (imageIndex) {
                    if (typeof timer !== "undefined") {
                        clearTimeout(timer);
                    }
                    current = imageIndex - 1;
                }

                $slides
                    .css('background-image', 'url("' + images[current] + '")')
                    .show(0, function () {
                        timer = setTimeout(slideshow, 10000);
                    });
            }

            if ($('.slider-controls').length) {
                for (var i = 0; i < count; i++) {
                    $('.slider-controls').append('<span data-index="' + (i+1) + '"></span>');
                }

                $('.slider-controls span').on('click', function () {
                    slideshow($(this).data('index'));
                });
            }

            slideshow(1);
        }
    }
}