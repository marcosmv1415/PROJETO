using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.DML
{
    public class Beneficiario
    {
 
        public long Id { get; set; }
        public string Cpf { get; set; }
        public string Nome { get; set; }
        public long IdCliente { get; set; }
    }
}
