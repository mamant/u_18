// Personal details form
$(".validate-form").validate({
   ignore: ".ignore",
   rules: {
    surname: "required",
    name: "required",
   },
   messages: {
    name: 'Перевірте правильність введення даних',
    surname: 'Перевірте правильність введення даних'
  },
  highlight: function(element, errorClass, validClass) {
    $(element).closest('.u-fields').addClass(errorClass).removeClass(validClass);
    $(element).closest('.u-fields').find('.icon').removeClass('icon-state-ok').addClass('icon-state-error');
  },
  unhighlight: function(element, errorClass, validClass) {
    $(element).closest('.u-fields').removeClass(errorClass).addClass(validClass);
    $(element).closest('.u-fields').find('.icon').removeClass('icon-state-error').addClass('icon-state-ok');
  },
  onfocusout: function(element) {
    this.element(element);
  },
 });
