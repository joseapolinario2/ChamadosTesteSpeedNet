$(document).ready(function () {
    $('.glyphicon-calendar').closest("div.date").datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: false,
        format: 'dd/mm/yyyy',
        autoclose: true,
        language: 'pt-BR'
    });

    $('#btnSalvar').on('click', function () {
        let dadosChamado = SerielizeForm($('#form'));

        $.ajax({
            url: 'Editar',
            type: 'POST',
            data: dadosChamado,
            success: function (response) {
                Swal.fire('Sucesso!', response.message, 'success');
            },
            error: function (result) {
                mensagensValidacao = JSON.parse(result.responseJSON.Message);
                $('#mensagens').empty();
                mensagensValidacao.forEach(function (mensagem) {
                    $('#mensagens').append("<li style='color: red'>" + mensagem + "</li>");
                });''
            }
        });
    });

    $('#btnCancelar').click(function () {
        Swal.fire({
            html: "Deseja cancelar essa operação? O registro não será salvo.",
            type: "warning",
            showCancelButton: true,
        }).then(function (result) {
            if (result.value) {
                history.back();
            } else {
                console.log("Cancelou a inclusão.");
            }
        });
    });

});