﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using WebApp_Desafio_FrontEnd.ApiClients.Desafio_API;
using WebApp_Desafio_FrontEnd.ViewModels;
using WebApp_Desafio_FrontEnd.ViewModels.Enums;
using AspNetCore.Reporting;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Infrastructure;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace WebApp_Desafio_FrontEnd.Controllers
{
    public class ChamadosController : Controller
    {
        private readonly IHostingEnvironment _hostEnvironment;

        public ChamadosController(IHostingEnvironment hostEnvironment)
        {
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return RedirectToAction(nameof(Listar));
        }

        [HttpGet]
        public IActionResult Listar()
        {
            // Busca de dados está na Action Datatable()
            return View();
        }

        [HttpGet]
        public IActionResult Datatable()
        {
            try
            {
                var chamadosApiClient = new ChamadosApiClient();
                var lstChamados = chamadosApiClient.ChamadosListar();

                var dataTableVM = new DataTableAjaxViewModel()
                {
                    length = lstChamados.Count,
                    data = lstChamados
                };

                return Ok(dataTableVM);
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseViewModel(ex));
            }
        }

        [HttpGet]
        public IActionResult Cadastrar()
        {
            var chamadoVM = new ChamadoViewModel()
            {
                DataAbertura = DateTime.Now
            };
            ViewData["Title"] = "Cadastrar Novo Chamado";

            try
            {
                var departamentosApiClient = new DepartamentosApiClient();

                ViewData["ListaDepartamentos"] = departamentosApiClient.DepartamentosListar();
            }
            catch (Exception ex)
            {
                ViewData["Error"] = ex.Message;
            }

            return View("Cadastrar", chamadoVM);
        }

       
        [HttpPost]
        public IActionResult Cadastrar(ChamadoViewModel chamadoVM)
        {
            try
            {
                var mensagensDeErro = new List<string>();

                if (!ModelState.IsValid)
                {
                    foreach (var erro in ModelState.Values.SelectMany(v => v.Errors))
                    {
                        mensagensDeErro.Add(erro.ErrorMessage);

                    }

                    // ViewBag.MensagensDeErro = mensagensDeErro;
                    throw new ApplicationException(JsonConvert.SerializeObject(mensagensDeErro));

                }

                
                if(chamadoVM.DataAbertura < DateTime.Today)
                {
                    mensagensDeErro.Add("Não é possível abrir chamado para data retroativa.");
                    throw new ApplicationException(JsonConvert.SerializeObject(mensagensDeErro));
                }


                var chamadosApiClient = new ChamadosApiClient();
                var realizadoComSucesso = chamadosApiClient.ChamadoGravar(chamadoVM);

                if (realizadoComSucesso)
                    return Ok(new ResponseViewModel(
                                $"Chamado gravado com sucesso!",
                                AlertTypes.success,
                                this.RouteData.Values["controller"].ToString(),
                                nameof(this.Listar)));
                else
                    throw new ApplicationException($"Falha ao excluir o Chamado.");
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseViewModel(ex));
            }
        }

        [HttpGet]
        public IActionResult Editar([FromRoute] int id)
        {
            ViewData["Title"] = "Editar Chamado";

            try
            {
                var chamadosApiClient = new ChamadosApiClient();
                var chamadoVM = chamadosApiClient.ChamadoObter(id);

                var departamentosApiClient = new DepartamentosApiClient();
                ViewData["ListaDepartamentos"] = departamentosApiClient.DepartamentosListar();

                return View("Editar", chamadoVM);
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseViewModel(ex));
            }
        }

        [HttpPost]
        public IActionResult Editar(ChamadoViewModel chamadoVM)
        {
            try
            {
                var mensagensDeErro = new List<string>();

                if (!ModelState.IsValid)
                {
                    foreach (var erro in ModelState.Values.SelectMany(v => v.Errors))
                    {
                        mensagensDeErro.Add(erro.ErrorMessage);

                    }

                    // ViewBag.MensagensDeErro = mensagensDeErro;
                    throw new ApplicationException(JsonConvert.SerializeObject(mensagensDeErro));

                }

                var chamadosApiClient = new ChamadosApiClient();
                
                var realizadoComSucesso = chamadosApiClient.EditarChamado(chamadoVM);

                if (realizadoComSucesso)
                    return Ok(new ResponseViewModel(
                                $"Departamento atualizado com sucesso!",
                                AlertTypes.success,
                                this.RouteData.Values["controller"].ToString(),
                                nameof(this.Listar)));
                else
                    throw new ApplicationException($"Falha ao incluir o Departamento.");
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseViewModel(ex));
            }
        }

        [HttpDelete]
        public IActionResult Excluir([FromRoute] int id)
        {
            try
            {
                var chamadosApiClient = new ChamadosApiClient();
                var realizadoComSucesso = chamadosApiClient.ChamadoExcluir(id);

                if (realizadoComSucesso)
                    return Ok(new ResponseViewModel(
                                $"Chamado {id} excluído com sucesso!",
                                AlertTypes.success,
                                "Chamados",
                                nameof(Listar)));
                else
                    throw new ApplicationException($"Falha ao excluir o Chamado {id}.");
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseViewModel(ex));
            }
        }

        [HttpGet]
        public IActionResult Report()
        {
            string mimeType = string.Empty;
            int extension = 1;
            string contentRootPath = _hostEnvironment.ContentRootPath;
            string path = Path.Combine(contentRootPath, "wwwroot", "reports", "rptChamados.rdlc");
            //
            // ... parameters
            //
            LocalReport localReport = new LocalReport(path);

            // Carrega os dados que serão apresentados no relatório
            var chamadosApiClient = new ChamadosApiClient();
            var lstChamados = chamadosApiClient.ChamadosListar();

            localReport.AddDataSource("dsChamados", lstChamados);

            // Renderiza o relatório em PDF
            ReportResult reportResult = localReport.Execute(RenderType.Pdf);

            //return File(reportResult.MainStream, "application/pdf");
            return File(reportResult.MainStream, "application/octet-stream", "rptChamados.pdf");
        }

    }
}
