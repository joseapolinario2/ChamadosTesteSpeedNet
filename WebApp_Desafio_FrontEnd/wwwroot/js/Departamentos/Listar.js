$(document).ready(function () {

    var table = $('#dataTables-Departamentos').DataTable({
        paging: false,
        ordering: false,
        info: false,
        searching: false,
        processing: true,
        serverSide: true,
        ajax: config.contextPath + 'Departamentos/Datatable',
        columns: [
            { data: 'ID' },
            { data: 'Descricao', title: 'Descrição' },
        ],
    });


    $('#btnAdicionar').click(function () {
        window.location.href = config.contextPath + 'Departamentos/Cadastrar';
    });

    $('#btnRelatorio').click(function () {
        window.location.href = config.contextPath + 'Departamentos/Report';
    });

    $('#dataTables-Departamentos tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#btnExcluir').click(function () {

        let data = table.row('.selected').data();
        let idRegistro = data.ID;
        if (!idRegistro || idRegistro <= 0) {
            return;
        }

        if (idRegistro) {
            Swal.fire({
                text: "Tem certeza de que deseja excluir " + data.Descricao + " ?",
                type: "warning",
                showCancelButton: true,
            }).then(function (result) {

                if (result.value) {
                    $.ajax({
                        url: config.contextPath + 'Departamentos/Excluir/' + idRegistro,
                        type: 'DELETE',
                        contentType: 'application/json',
                        error: function (result) {

                            Swal.fire({
                                text: result,
                                confirmButtonText: 'OK',
                                icon: 'error'
                            });

                        },
                        success: function (result) {

                            Swal.fire({
                                type: result.Type,
                                title: result.Title,
                                text: result.Message,
                            }).then(function () {
                                table.draw();
                            });
                        }
                    });
                } else {
                    console.log("Cancelou a exclusão.");
                }

            });
        }
    });

    let selectedRow = null;

    function finalizarEdicaoAtual() {
        if (selectedRow) {
            let descricaoOriginal = selectedRow.find('td:eq(1) input').val();
            selectedRow.find('td:eq(1)').html(descricaoOriginal);
            selectedRow.removeClass('editing');
            selectedRow.find('td:last').find('#btnSalvar, #btnCancelar').remove();
            selectedRow = null;
        }
    }

    $('#dataTables-Departamentos tbody').on('dblclick', 'tr', function () {
        finalizarEdicaoAtual();

        selectedRow = $(this);
        if (selectedRow.hasClass('editing')) {
            return; 
        }

        selectedRow.addClass('editing');

        selectedRow.find('td').each(function (index, td) {
            let currentText = $(td).text();
            if (index !== 0) { // ID geralmente não é editável
                $(td).html(`<input type="text" class="form-control" value="${currentText}" />`);
            }
        });

        selectedRow.find('td:last').append(`
                    <button type="button" class="btn btn-success btn-sm" id="btnSalvarEd">Salvar</button>
                    <button type="button" class="btn btn-danger btn-sm ml-2" id="btnCancelar">Cancelar</button>
                `);

        $('#btnSalvarEd').on('click', function () {
            let departamentoID = selectedRow.find('td:eq(0)').text();
            let descricao = selectedRow.find('td:eq(1) input').val(); 

            $.ajax({
                url: 'Editar',
                type: 'POST',
                data: {
                    ID: departamentoID,
                    Descricao: descricao
                },
                success: function (response) {
                    Swal.fire('Sucesso!', response.message, 'success');

                    selectedRow.find('td:eq(1)').html(descricao);

                    selectedRow.removeClass('editing');
                    selectedRow.find('td:last').find('#btnSalvar, #btnCancelar').remove();
                    selectedRow = null;
                },
                error: function () {
                    Swal.fire('Erro!', 'Não foi possível salvar a edição.', 'error');
                }
            });
        });
        $('#btnCancelar').on('click', function () {
            let descricaoOriginal = selectedRow.find('td:eq(1) input').val();
            selectedRow.find('td:eq(1)').html(descricaoOriginal);

            selectedRow.removeClass('editing');
            selectedRow.find('td:last').find('#btnSalvar, #btnCancelar').remove();
            selectedRow = null;
        });
    });
});