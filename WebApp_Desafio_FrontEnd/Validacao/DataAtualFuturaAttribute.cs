using System;
using System.ComponentModel.DataAnnotations;

namespace WebApp_Desafio_FrontEnd.Validacao
{
  
    public class DataAtualFuturaAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value == null)
                return true; // Considere válido se for nulo. Use [Required] se precisar que seja obrigatório.

            DateTime data;
            if (DateTime.TryParse(value.ToString(), out data))
            {
                return data >= DateTime.Today; // Verifica se a data é maior ou igual a hoje.
            }

            return false; // Se não for possível converter, considera inválido.
        }

        public override string FormatErrorMessage(string name)
        {
            return $"O campo {name} deve ser uma data maior ou igual a hoje.";
        }
    }

}
