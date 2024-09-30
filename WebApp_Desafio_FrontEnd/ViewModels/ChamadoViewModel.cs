using System;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Runtime.Serialization;
using WebApp_Desafio_FrontEnd.Validacao;

namespace WebApp_Desafio_FrontEnd.ViewModels
{
    [DataContract]
    public class ChamadoViewModel
    {
        private CultureInfo ptBR = new CultureInfo("pt-BR");

        [Display(Name = "ID")]
        [DataMember(Name = "ID")]
        public int ID { get; set; }

        [Display(Name = "Assunto")]
        [DataMember(Name = "Assunto")]
        [Required(ErrorMessage = "O assunto é obrigatório.")]
        [StringLength(100, ErrorMessage = "O assunto não pode ter mais de 100 caracteres.")]
        public string Assunto { get; set; }

        [Display(Name = "Solicitante")]
        [DataMember(Name = "Solicitante")]
        [Required(ErrorMessage = "O solicitante é obrigatório.")]
        [StringLength(100, ErrorMessage = "O solicitante não pode ter mais de 100 caracteres.")]
        public string Solicitante { get; set; }

        [Display(Name = "IdDepartamento")]
        [DataMember(Name = "IdDepartamento")]
        [Required(ErrorMessage = "O departamento é obrigatório.")]
        [Range(1, int.MaxValue, ErrorMessage = "O valor fornecido para o campo id deve ser um número positivo.")]
        public int? IdDepartamento { get; set; }

        [Display(Name = "Departamento")]
        [DataMember(Name = "Departamento")]
        public string Departamento { get; set; }

        [Display(Name = "Data de Abertura")]
        [DataMember(Name = "DataAbertura")]
        [Required(ErrorMessage = "A data de abertura é obrigatória.")]
        [DataType(DataType.Date)]
        public DateTime DataAbertura { get; set; }

        [DataMember(Name = "DataAberturaWrapper")]
        public string DataAberturaWrapper
        {
            get
            {
                return DataAbertura.ToString("d", ptBR);
            }
            set
            {
                DataAbertura = DateTime.Parse(value, ptBR);
            }
        }
    }
}
