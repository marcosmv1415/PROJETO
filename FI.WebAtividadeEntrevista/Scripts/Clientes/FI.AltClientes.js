$(document).ready(function () {
    var beneficiariosArray = [];

    $('#beneficiariosdv').css('display', 'block');
    $('#cpfBeneficiario').on('input', function () {
        var cpf = $(this).val().replace(/\D/g, '');
        var cpfFormatado = formatarCPF(cpf);
        $(this).val(cpfFormatado);
    });

    $('#beneficiarios').click(function () {
        $('#BenefModal').modal('show');
        popularGridBeneficiarios();
    });

    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #Cep').val(obj.Cep);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        if (obj.Cpf) {
            var cpfFormatado = formatarCPF(obj.Cpf);
            $('#formCadastro #Cpf').val(cpfFormatado);
        }
        if (obj.Beneficiarios) {
            beneficiariosArray = obj.Beneficiarios.map(function (beneficiario) {
                return {
                    Cpf: formatarCPF(beneficiario.Cpf),
                    Nome: beneficiario.Nome
                };
            });
            salvarBeneficiariosLocalStorage();
            popularGridBeneficiarios(); 
        }
    }

    $('#Cpf').on('input', function () {
        var cpf = $(this).val().replace(/\D/g, '');
        var cpfFormatado = formatarCPF(cpf);
        $(this).val(cpfFormatado);
    });

    function formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length > 3 && cpf.length <= 6) {
            cpf = cpf.replace(/^(\d{3})(\d+)/, '$1.$2');
        } else if (cpf.length > 6 && cpf.length <= 9) {
            cpf = cpf.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
        } else if (cpf.length > 9) {
            cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return cpf;
    }

    $('#formBeneficiarios').submit(function (e) {
        e.preventDefault();
        var cpf = $('#cpfBeneficiario').val().replace(/\D/g, ''); 
        var nome = $('#nomeBeneficiario').val();

        if (!validarCPF(cpf)) {
            alert('CPF inválido. Por favor, verifique o CPF informado.');
            return;
        }
        var cpfFormatado = formatarCPF(cpf);


        var cpfExistente = false;
        $('#beneficiariosTable tbody tr').each(function () {
            var cpfExistenteTabela = $(this).find('td').eq(0).text();
            if (cpfExistenteTabela === cpfFormatado) {
                cpfExistente = true;
                return false;
            }
        });

        if (cpfExistente) {
            alert('O CPF informado já existe na lista.');
        } else {

            var novaLinha = `
                <tr>
                    <td>${cpfFormatado}</td>
                    <td>${nome}</td>
                    <td class="table-actions">
                        <button type="button" class="btn btn-primary btn-sm alterar">Alterar</button>
                        <button type="button" class="btn btn-primary btn-sm excluir">Excluir</button>
                    </td>
                </tr>
            `;
            $('#beneficiariosTable tbody').append(novaLinha);

            beneficiariosArray.push({
                Cpf: cpfFormatado,
                Nome: nome
            });

            salvarBeneficiariosLocalStorage();

            $('#formBeneficiarios')[0].reset();
        }
    });

    $(document).on('click', '.excluir', function () {
        var linha = $(this).closest('tr');
        var cpfFormatado = linha.find('td').eq(0).text();
        var cpf = cpfFormatado.replace(/\D/g, ''); 

        beneficiariosArray = beneficiariosArray.filter(function (beneficiario) {
            return beneficiario.Cpf !== cpfFormatado;
        });

        linha.remove();


        salvarBeneficiariosLocalStorage();
    });


    function popularGridBeneficiarios() {

        $('#beneficiariosTable tbody').empty();


        beneficiariosArray.forEach(function (beneficiario) {
            var cpfFormatado = formatarCPF(beneficiario.Cpf);
            var linhaBeneficiario = `
                <tr>
                    <td>${cpfFormatado}</td>
                    <td>${beneficiario.Nome}</td>
                    <td class="table-actions">
                        <button type="button" class="btn btn-primary btn-sm alterar">Alterar</button>
                        <button type="button" class="btn btn-primary btn-sm excluir">Excluir</button>
                    </td>
                </tr>
            `;
            $('#beneficiariosTable tbody').append(linhaBeneficiario);
        });
    }

    function salvarBeneficiariosLocalStorage() {
        var beneficiariosParaSalvar = beneficiariosArray.map(function (beneficiario) {
            return {
                Cpf: beneficiario.Cpf,
                Nome: beneficiario.Nome
            };
        });
        localStorage.setItem('beneficiarios', JSON.stringify(beneficiariosParaSalvar));
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11) return false;
        var numeros = cpf.substring(0, 9);
        var digitos = cpf.substring(9);
        var soma = 0;
        for (var i = 10; i > 1; i--) {
            soma += numeros.charAt(10 - i) * i;
        }
        var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) return false;
        soma = 0;
        numeros = cpf.substring(0, 10);
        for (var i = 11; i > 1; i--) {
            soma += numeros.charAt(11 - i) * i;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) return false;
        return true;
    }


    $(document).on('click', '.alterar', function () {
        var linha = $(this).closest('tr');
        var cpfFormatado = linha.find('td').eq(0).text();
        var nome = linha.find('td').eq(1).text();


        beneficiariosArray = beneficiariosArray.filter(function (beneficiario) {
            return beneficiario.Cpf !== cpfFormatado;
        });


        linha.remove();


        $('#cpfBeneficiario').val(cpfFormatado);
        $('#nomeBeneficiario').val(nome);
    });


    $('#formCadastro').submit(function (e) {
        e.preventDefault();


        var formData = new FormData();
        formData.append("NOME", $('#Nome').val());
        formData.append("CEP", $('#Cep').val());
        formData.append("Email", $('#Email').val());
        formData.append("Sobrenome", $('#Sobrenome').val());
        formData.append("Nacionalidade", $('#Nacionalidade').val());
        formData.append("Estado", $('#Estado').val());
        formData.append("Cidade", $('#Cidade').val());
        formData.append("Logradouro", $('#Logradouro').val());
        formData.append("Telefone", $('#Telefone').val());
        formData.append("Cpf", $('#Cpf').val());

        beneficiariosArray.forEach(function (beneficiario, index) {
            formData.append(`Beneficiarios[${index}].Cpf`, beneficiario.Cpf);
            formData.append(`Beneficiarios[${index}].Nome`, beneficiario.Nome);
        });


        $.ajax({
            url: urlPost,
            method: "POST",
            processData: false,
            contentType: false,
            data: formData,
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success: function (r) {
                ModalDialog("Sucesso!", r);
                $("#formCadastro")[0].reset();
                window.location.href = urlRetorno;
            }
        });
    });
});

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var textoModal = '<div id="' + random + '" class="modal fade">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
        '<h4 class="modal-title">' + titulo + '</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<p>' + texto + '</p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>' +
        '</div>' +
        '</div><!-- /.modal-content -->' +
        '</div><!-- /.modal-dialog -->' +
        '</div><!-- /.modal -->';

    $('body').append(textoModal);
    $('#' + random).modal('show');
}
