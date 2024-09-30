using System;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Runtime.Serialization;

namespace WebApp_Desafio_FrontEnd.ViewModels
{
    [DataContract]
    public class DepartamentoViewModel
    {
        // Validação para ID
        [Display(Name = "ID")]
        [DataMember(Name = "ID")]
        public int ID { get; set; }

        // Validação para Descricao
        [Display(Name = "Descrição")]
        [DataMember(Name = "Descricao")]
        [Required(ErrorMessage = "O campo {0} é obrigatório.")] // O campo Descrição é obrigatório
        [StringLength(100, ErrorMessage = "O campo {0} deve ter no máximo {1} caracteres.")] // Limite de 200 caracteres
        public string Descricao { get; set; }
    }
}
