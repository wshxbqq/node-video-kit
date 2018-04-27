$(".left-title").on("click", function (e) {
    let $this = $(this);
    $(".left-container").hide();
    $this.next().show();
})

$(".left-block .left-container a").on("click", function (e) {
    if (window.top.processing) {
        e.preventDefault();
        return;
    }
    let $this = $(this);
    $(".sp-1").html($this.parent().parent().prev().text());
    $(".sp-2").html($this.text());

    $("#video").hide();
});