using FI.AtividadeEntrevista.DAL;
using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        public long AdicionarBeneficiario(DML.Beneficiario beneficiario)
        {
            DAL.DaoBeneficiario bli = new DAL.DaoBeneficiario();
            return bli.AdicionarBeneficiario(beneficiario);
        }
      
        public List<Beneficiario> ObterBeneficiariosPorCliente(long idCliente)
        {
          DaoBeneficiario daoBeneficiario = new DaoBeneficiario();
            return daoBeneficiario.ConsultarPorCliente(idCliente);
        }
        public void LimparBeneficiarios(long idcliente)
        {
            DAL.DaoBeneficiario bli = new DAL.DaoBeneficiario();
            bli.LimparBeneficiarios(idcliente);
        }

    }
}
