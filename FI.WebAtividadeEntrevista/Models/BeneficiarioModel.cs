using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace FI.WebAtividadeEntrevista.Models
{
    public class BeneficiarioModel
    {
        public long Id { get; set; }

        [Required]
        [Cpf]
        [Display(Name = "CPF")]
        public string Cpf { get; set; }
        public string Nome { get; set; }
        public long IdCliente { get; set; }

    }
}