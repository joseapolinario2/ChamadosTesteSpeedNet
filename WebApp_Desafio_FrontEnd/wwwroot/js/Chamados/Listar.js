$(document).ready(function () {

    var table = $('#dataTables-Chamados').DataTable({
        paging: false,
        ordering: false,
        info: false,
        searching: false,
        processing: true,
        serverSide: true,
        ajax: config.contextPath + 'Chamados/Datatable',
        columns: [
            { data: 'ID' },
            { data: 'Assunto' },
            { data: 'Solicitante' },
            { data: 'Departamento' },
            { data: 'DataAberturaWrapper', title: 'Data Abertura' }
        ],
    });

    $('#dataTables-Chamados tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#btnRelatorio').click(function () {
        window.location.href = config.contextPath + 'Chamados/Report';
    });

    $('#btnAdicionar').click(function () {
        window.location.href = config.contextPath + 'Chamados/Cadastrar';
    });

    $('#btnEditar').click(function () {
        var data = table.row('.selected').data();
        window.location.href = config.contextPath + 'Chamados/Editar/' + data.ID;
    });

    $('#btnExcluir').click(function () {

        let data = table.row('.selected').data();
        let idRegistro = data.ID;
        if (!idRegistro || idRegistro <= 0) {
            return;
        }

        if (idRegistro) {
            Swal.fire({
                text: "Tem certeza de que deseja excluir " + data.Assunto + " ?",
                type: "warning",
                showCancelButton: true,
            }).then(function (result) {

                if (result.value) {
                    $.ajax({
                        url: config.contextPath + 'Chamados/Excluir/' + idRegistro,
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
    // Funcionalidade de editar com dbclick
    
    // Variável global para armazenar a linha que está sendo editada
    let selectedRow = null;
    // Variáveis para armazenar os valores originais dos campos
    let originalAssunto = null;
    let originalSolicitante = null;
    let originalDepartamento = null;
    let originalDataAbertura = null;

    // Função para finalizar a edição atual, restaurando os valores originais se necessário
    function finalizarEdicaoAtual() {
        if (selectedRow) {
            // Restaurar os valores originais
            selectedRow.find('td:eq(1)').html(originalAssunto);
            selectedRow.find('td:eq(2)').html(originalSolicitante);
            selectedRow.find('td:eq(3)').html(originalDepartamento);
            selectedRow.find('td:eq(4)').html(originalDataAbertura);

            // Remove a classe de edição
            selectedRow.removeClass('editing');

            // Remove os botões "Salvar" e "Cancelar"
            selectedRow.find('td:last').find('#btnSalvarEd, #btnCancelar').remove();

            // Reseta a variável para null, indicando que não há mais linha em edição
            selectedRow = null;
        }
    }

    


    // Evento de duplo clique na tabela para ativar o modo de edição
    $('#dataTables-Chamados tbody').on('dblclick', 'tr', function () {
        finalizarEdicaoAtual();

        selectedRow = $(this);
        if (selectedRow.hasClass('editing')) {
            return;
        }

        selectedRow.addClass('editing');

        // Armazenar os valores originais antes de transformar em inputs
        originalAssunto = selectedRow.find('td:eq(1)').text();
        originalSolicitante = selectedRow.find('td:eq(2)').text();
        originalDepartamento = selectedRow.find('td:eq(3)').text();
        originalDataAbertura = selectedRow.find('td:eq(4)').text();

        var optionsHtml = '';

        $.ajax({
            url: config.contextPath + 'Departamentos/Datatable',
            type: 'GET',
            async: false,
            success: function (response) {
                response.data.forEach(function (departamento) {
                    let isSelected = departamento.Descricao === originalDepartamento ? 'selected' : '';
                    optionsHtml += `<option value="${departamento.ID}" ${isSelected}>${departamento.Descricao}</option>`;
                });
            },
            error: function () {
                console.log('Erro!', 'Não foi possível carregar os departamentos.', 'error');
            }
        });

        // Transformar as células da linha em campos de edição
        selectedRow.find('td:eq(1)').html(`<input type="text" class="form-control" value="${originalAssunto}" />`);
        selectedRow.find('td:eq(2)').html(`<input type="text" class="form-control" value="${originalSolicitante}" />`);
        selectedRow.find('td:eq(3)').html(`<select id='slcDepartamento' class="form-control" id="selectDepartamento">${optionsHtml}</select>`);
        selectedRow.find('td:eq(4)').html(`<input type="text" class="form-control" value="${originalDataAbertura}" />`);

        // Adicionar botões "Salvar" e "Cancelar"
        selectedRow.find('td:eq(4)').append(`
        <button type="button" class="btn btn-success btn-sm" id="btnSalvarEd">Salvar</button>
        <button type="button" class="btn btn-danger btn-sm ml-2" id="btnCancelar">Cancelar</button>`);
        let selectDepartamento = $('#selectDepartamento');

        selectDepartamento.val(originalDepartamento);

        $('#btnSalvarEd').on('click', function () {
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

        // Evento de clique no botão "Cancelar"
        $('#btnCancelar').on('click', function () {
            // Restaurar os valores originais ao cancelar a edição
            finalizarEdicaoAtual();
        });
    });

});