using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

public class CpfAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if (value == null)
        {
            return new ValidationResult("CPF é obrigatório");
        }

        var cpf = value.ToString();

        // Verifica se o formato está correto
        if (!Regex.IsMatch(cpf, @"^\d{3}\.\d{3}\.\d{3}\-\d{2}$"))
        {
            return new ValidationResult("CPF deve estar no formato 999.999.999-99");
        }

        // Remove caracteres especiais para validar o dígito verificador
        cpf = cpf.Replace(".", "").Replace("-", "");

        // Verifica se o CPF é válido
        if (!IsValidCpf(cpf))
        {
            return new ValidationResult("CPF inválido");
        }

        return ValidationResult.Success;
    }

    private bool IsValidCpf(string cpf)
    {
        if (cpf.Length != 11)
            return false;

        for (int j = 0; j < 10; j++)
            if (j.ToString().PadLeft(11, char.Parse(j.ToString())) == cpf)
                return false;

        var numbers = new int[11];

        for (int i = 0; i < 11; i++)
            numbers[i] = int.Parse(cpf[i].ToString());

        int soma = 0;

        for (int i = 0; i < 9; i++)
            soma += (10 - i) * numbers[i];

        var resultado = soma % 11;
        if (resultado == 1 || resultado == 0)
        {
            if (numbers[9] != 0)
                return false;
        }
        else if (numbers[9] != 11 - resultado)
            return false;

        soma = 0;
        for (int i = 0; i < 10; i++)
            soma += (11 - i) * numbers[i];

        resultado = soma % 11;
        if (resultado == 1 || resultado == 0)
        {
            if (numbers[10] != 0)
                return false;
        }
        else if (numbers[10] != 11 - resultado)
            return false;

        return true;
    }
}
