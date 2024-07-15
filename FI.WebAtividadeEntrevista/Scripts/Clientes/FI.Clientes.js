$(document).ready(function () {
    var beneficiariosArray = [];

    // Exibe o botão de beneficiários e configura a formatação do CPF
    $('#beneficiariosdv').css('display', 'block');
    $('#cpfBeneficiario').on('input', function () {
        var cpf = $(this).val().replace(/\D/g, '');
        var cpfFormatado = formatarCPF(cpf);
        $(this).val(cpfFormatado);
    });

    // Ao clicar em "Beneficiários", abre o modal
    $('#beneficiarios').click(function () {
        $('#BenefModal').modal('show');
        popularGridBeneficiarios();
    });

    // Carrega dados do objeto `obj` se existir
    if (typeof obj !== 'undefined' && obj !== null) {
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
            salvarBeneficiariosLocalStorage(); // Salva os beneficiários no localStorage ao carregar os dados do cliente
            popularGridBeneficiarios(); // Chama a função para popular a tabela com os beneficiários existentes
        }
    }

    // Formata o CPF no campo #Cpf enquanto digita
    $('#Cpf').on('input', function () {
        var cpf = $(this).val().replace(/\D/g, '');
        var cpfFormatado = formatarCPF(cpf);
        $(this).val(cpfFormatado);
    });

    // Função para formatar o CPF
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

    // Submit do formulário de cadastro de beneficiários
    $('#formBeneficiarios').submit(function (e) {
        e.preventDefault();
        var cpf = $('#cpfBeneficiario').val().replace(/\D/g, ''); // Remove caracteres não numéricos
        var nome = $('#nomeBeneficiario').val();

        // Validação e formatação do CPF
        if (!validarCPF(cpf)) {
            alert('CPF inválido. Por favor, verifique o CPF informado.');
            return;
        }
        var cpfFormatado = formatarCPF(cpf);

        // Verifica se o CPF já existe na tabela de beneficiários
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
            // Adiciona nova linha na tabela de beneficiários
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

            // Adiciona o beneficiário ao array beneficiariosArray
            beneficiariosArray.push({
                Cpf: cpfFormatado, // Mantém CPF formatado no array
                Nome: nome
            });

            // Salva no localStorage
            salvarBeneficiariosLocalStorage();

            // Limpa o formulário do modal de beneficiários
            $('#formBeneficiarios')[0].reset();
        }
    });

    // Função para excluir linha da tabela de beneficiários
    $(document).on('click', '.excluir', function () {
        var linha = $(this).closest('tr');
        var cpfFormatado = linha.find('td').eq(0).text();

        // Remove o beneficiário do array beneficiariosArray
        beneficiariosArray = beneficiariosArray.filter(function (beneficiario) {
            return beneficiario.Cpf !== cpfFormatado;
        });

        // Remove a linha da tabela de beneficiários
        linha.remove();

        // Atualiza o localStorage
        salvarBeneficiariosLocalStorage();
    });

    // Função para popular a tabela de beneficiários dentro do modal
    function popularGridBeneficiarios() {
        // Limpa a tabela de beneficiários
        $('#beneficiariosTable tbody').empty();

        // Itera sobre o array de beneficiários
        beneficiariosArray.forEach(function (beneficiario) {
            var linhaBeneficiario = `
                <tr>
                    <td>${beneficiario.Cpf}</td>
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

    // Função para salvar beneficiários no localStorage
    function salvarBeneficiariosLocalStorage() {
        localStorage.setItem('beneficiarios', JSON.stringify(beneficiariosArray));
    }

    // Função para validar CPF
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

    // Função para alterar linha da tabela de beneficiários
    $(document).on('click', '.alterar', function () {
        var linha = $(this).closest('tr');
        var cpfFormatado = linha.find('td').eq(0).text();
        var nome = linha.find('td').eq(1).text();

        // Remove o beneficiário do array beneficiariosArray
        beneficiariosArray = beneficiariosArray.filter(function (beneficiario) {
            return beneficiario.Cpf !== cpfFormatado;
        });

        // Remove a linha da tabela de beneficiários
        linha.remove();

        // Preenche o formulário do modal com os dados do beneficiário a ser alterado
        $('#cpfBeneficiario').val(cpfFormatado);
        $('#nomeBeneficiario').val(nome);
    });

    // Carrega beneficiários do localStorage ao iniciar
    function carregarBeneficiariosLocalStorage() {
        var beneficiariosSalvos = localStorage.getItem('beneficiarios');
        if (beneficiariosSalvos) {
            beneficiariosArray = JSON.parse(beneficiariosSalvos);
        }
    }
    carregarBeneficiariosLocalStorage();

    // Submit do formulário de cadastro do cliente
    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        var formData = new FormData();
        formData.append("Nome", $('#Nome').val());
        formData.append("Cep", $('#Cep').val());
        formData.append("Email", $('#Email').val());
        formData.append("Sobrenome", $('#Sobrenome').val());
        formData.append("Nacionalidade", $('#Nacionalidade').val());
        formData.append("Estado", $('#Estado').val());
        formData.append("Cidade", $('#Cidade').val());
        formData.append("Logradouro", $('#Logradouro').val());
        formData.append("Telefone", $('#Telefone').val());
        formData.append("Cpf", $('#Cpf').val()); // CPF formatado

        beneficiariosArray.forEach(function (beneficiario, index) {
            formData.append(`Beneficiarios[${index}].Cpf`, beneficiario.Cpf); // CPF formatado
            formData.append(`Beneficiarios[${index}].Nome`, beneficiario.Nome);
        });

        $.ajax({
            type: "POST",
            url: "/Cliente/Incluir",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                alert(response);
                $('#formCadastro')[0].reset();
                beneficiariosArray = [];
                salvarBeneficiariosLocalStorage();
                popularGridBeneficiarios();
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    });
});
