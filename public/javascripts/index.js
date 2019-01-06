$(document).ready(() => {
  //Alpha Numeric plus minimum 8
  var good = /^(?=\S*?[a-z])(?=\S*?[0-9])\S{8,}$/;
  //Must contain at least one upper case letter, one lower case letter and (one number OR one special char).
  var better = /^(?=\S*?[A-Z])(?=\S*?[a-z])((?=\S*?[0-9])|(?=\S*?[^\w\*]))\S{8,}$/;
  //Must contain at least one upper case letter, one lower case letter and (one number AND one special char).
  var best = /^(?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[^\w\*])\S{8,}$/;

  $("#password-field").on("keyup", () => {
    var password = $(this),
      pass = password.val(),
      strength = "Very Weak",
      pclass = "danger";

    if (best.test(pass) == true) {
      strength = "Very Strong";
      pclass = "success";
    } else if (better.test(pass) == true) {
      strength = "Strong";
      pclass = "success";
    } else if (good.test(pass) == true) {
      strength = "Weak";
      pclass = "warning";
    } else {
      strength = "Very Weak";
    }

    var popover = password.attr("data-content", strength).data("bs.popover");
    popover.setContent();
    popover.$tip
      .addClass(popover.options.placement)
      .removeClass("danger success info warning primary")
      .addClass(pclass);
  });

  $('input[data-toggle="popover"]').popover({
    placement: "bottom",
    trigger: "focus"
  });
});
