$(document).ready(function () {


    
    // Funcionalidade de editar com dbclick
    
    let selectedRow = null;
    let originalAssunto = null;
    let originalSolicitante = null;
    let originalDepartamento = null;
    let originalDataAbertura = null;
    function finalizarEdicaoAtual() {
        if (selectedRow) {
            selectedRow.find('td:eq(1)').html(originalAssunto);
            selectedRow.find('td:eq(2)').html(originalSolicitante);
            selectedRow.find('td:eq(3)').html(originalDepartamento);
            selectedRow.find('td:eq(4)').html(originalDataAbertura);
            selectedRow.removeClass('editing');
            selectedRow.find('td:last').find('#btnSalvarEd, #btnCancelar').remove();
            selectedRow = null;
        }
    }

    $('#dataTables-Chamados tbody').on('dblclick', 'tr', function () {
        $('#btnSalvar').on('click', function () {
            let dadosChamado = {
                ID: selectedRow.find('td:eq(0)').text(),
                Assunto: selectedRow.find('td:eq(1) input').val(),
                Solicitante: selectedRow.find('td:eq(2) input').val(),
                Departamento: selectedRow.find('td:eq(3) select option:selected').text(),
                IdDepartamento: selectedRow.find('td:eq(3) select').val(),
                DataAbertura: selectedRow.find('td:eq(4) input').val()
            };

            $.ajax({
                url: 'Editar',
                type: 'POST',
                data: dadosChamado,
                success: function (response) {
                    Swal.fire('Sucesso!', response.message, 'success');

                    selectedRow.find('td:eq(1)').html(dadosChamado.Assunto);
                    selectedRow.find('td:eq(2)').html(dadosChamado.Solicitante);
                    selectedRow.find('td:eq(3)').html(dadosChamado.Departamento);
                    selectedRow.find('td:eq(4)').html(dadosChamado.DataAbertura);

                    selectedRow.removeClass('editing');
                    selectedRow.find('td:last').find('#btnSalvarEd, #btnCancelar').remove();
                    selectedRow = null;
                },
                error: function () {
                    Swal.fire('Erro!', 'Não foi possível salvar a edição.', 'error');
                }
            });
        });
        $('#btnCancelar').on('click', function () {
            // Restaurar os valores originais ao cancelar a edição
            finalizarEdicaoAtual();
        });
    });

});