using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using System.Security.Cryptography.X509Certificates;
using FI.WebAtividadeEntrevista.Models;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            
            BoCliente bo = new BoCliente();
            bool existe = false;
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                string cpfNumerico = new String(model.Cpf.Where(Char.IsDigit).ToArray());
                existe = bo.VerificarExistencia(cpfNumerico);
              if (existe == true)
                {
                    Response.StatusCode = 400;
                    return Json("Esse CPF já está sendo utilizado");
                }
                model.Id = bo.Incluir(new Cliente()
                {                    
                    Cep = model.Cep,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    Cpf = cpfNumerico
                });

                if (model.Beneficiarios != null)
                {
                    BoBeneficiario boBenefic = new BoBeneficiario();
                    boBenefic.LimparBeneficiarios(model.Id);

                    foreach (var beneficiario in model.Beneficiarios)
                    {
                        string cpfBeneficiarioNumerico = new string(beneficiario.Cpf.Where(char.IsDigit).ToArray());
                        boBenefic.AdicionarBeneficiario(new Beneficiario
                        {
                            IdCliente = model.Id,
                            Cpf = cpfBeneficiarioNumerico,
                            Nome = beneficiario.Nome
                        });
                    }
                }

                return Json("Cadastro efetuado com sucesso");
            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();

            if (!ModelState.IsValid)
            {
                List<string> erros = ModelState.Values
                    .SelectMany(item => item.Errors)
                    .Select(error => error.ErrorMessage)
                    .ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }

            string cpfNumerico = new string(model.Cpf.Where(char.IsDigit).ToArray());
            bool existe = bo.VerificarDuplicidadeCpf(cpfNumerico, model.Id);
            if (existe)
            {
                Response.StatusCode = 400;
                return Json("Esse CPF já está sendo utilizado em outro cadastro");
            }
            
            Cliente cliente = new Cliente
            {
                Id = model.Id,
                Cep = model.Cep,
                Cidade = model.Cidade,
                Email = model.Email,
                Estado = model.Estado,
                Logradouro = model.Logradouro,
                Nacionalidade = model.Nacionalidade,
                Nome = model.Nome,
                Sobrenome = model.Sobrenome,
                Telefone = model.Telefone,
                Cpf = cpfNumerico
            };

            bo.Alterar(cliente);

            if (model.Beneficiarios != null)
            {
                BoBeneficiario boBenefic = new BoBeneficiario();
                boBenefic.LimparBeneficiarios(cliente.Id);

                foreach (var beneficiario in model.Beneficiarios)
                {
                    string cpfBeneficiarioNumerico = new string(beneficiario.Cpf.Where(char.IsDigit).ToArray());
                    boBenefic.AdicionarBeneficiario(new Beneficiario
                    {
                        IdCliente = cliente.Id,
                        Cpf = cpfBeneficiarioNumerico,
                        Nome = beneficiario.Nome
                    });
                }
            }

            return Json("Cadastro alterado com sucesso");
        }


        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente boCliente = new BoCliente();
            Cliente cliente = boCliente.Consultar(id);
            Models.ClienteModel model = null;

            if (cliente != null)
            {

                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    Cep = cliente.Cep,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    Cpf = cliente.Cpf,
                    Beneficiarios = new List<BeneficiarioModel>()
                };


                BoBeneficiario boBeneficiario = new BoBeneficiario();
                List<Beneficiario> beneficiarios = boBeneficiario.ObterBeneficiariosPorCliente(cliente.Id);

               
                foreach (var beneficiario in beneficiarios)
                {
                    model.Beneficiarios.Add(new BeneficiarioModel()
                    {
                        Id = beneficiario.Id,
                        Cpf = beneficiario.Cpf,
                        Nome = beneficiario.Nome,
                        IdCliente = beneficiario.IdCliente
                    });
                }
            }

            return View(model);
        }


        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
    }
}