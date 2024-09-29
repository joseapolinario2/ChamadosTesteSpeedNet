using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using WebApp_Desafio_FrontEnd.ViewModels;

namespace WebApp_Desafio_FrontEnd.ApiClients.Desafio_API
{
    public class DepartamentosApiClient : BaseClient
    {
        private const string tokenAutenticacao = "AEEFC184-9F62-4B3E-BB93-BE42BF0FFA36";

        private const string departamentosListUrl = "api/Departamentos/Listar";
        private const string departamentosGravarUrl = "api/Departamentos/Gravar";

        private string desafioApiUrl = "https://localhost:44388/"; // Endereço API IIS-Express
        private string departamentoExcluirUrl = "api/Departamentos/Excluir";
        private string departamentosEditarUrl = "api/Departamentos/Editar";

        public DepartamentosApiClient() : base()
        {
            //TODO
        }

        public bool GravarDepartamento(DepartamentoViewModel departamento)
        {
            var headers = new Dictionary<string, object>()
            {
                { "TokenAutenticacao", tokenAutenticacao }
            };

            var response = base.Post($"{desafioApiUrl}{departamentosGravarUrl}", departamento, headers);

            base.EnsureSuccessStatusCode(response);

            string json = base.ReadHttpWebResponseMessage(response);

            return JsonConvert.DeserializeObject<bool>(json);
        }

        public bool EditarDepartamento(DepartamentoViewModel departamento)
        {
            var headers = new Dictionary<string, object>()
            {
                { "TokenAutenticacao", tokenAutenticacao }
            };

            var response = base.Post($"{desafioApiUrl}{departamentosEditarUrl}", departamento, headers);

            base.EnsureSuccessStatusCode(response);

            string json = base.ReadHttpWebResponseMessage(response);

            return JsonConvert.DeserializeObject<bool>(json);
        }

        public List<DepartamentoViewModel> DepartamentosListar()
        {
            var headers = new Dictionary<string, object>()
            {
                { "TokenAutenticacao", tokenAutenticacao }
            };

            var querys = default(Dictionary<string, object>); // Não há parâmetros para essa chamada

            var response = base.Get($"{desafioApiUrl}{departamentosListUrl}", querys, headers);

            base.EnsureSuccessStatusCode(response);

            string json = base.ReadHttpWebResponseMessage(response);

            return JsonConvert.DeserializeObject<List<DepartamentoViewModel>>(json);
        }

        public bool DepartamentoExcluir(int idDepartamento)
        {
            var headers = new Dictionary<string, object>()
            {
                { "TokenAutenticacao", tokenAutenticacao }
            };

            var querys = new Dictionary<string, object>()
            {
                { "idDepartamento", idDepartamento }
            };

            var response = base.Delete($"{desafioApiUrl}{departamentoExcluirUrl}", querys, headers);

            base.EnsureSuccessStatusCode(response);

            string json = base.ReadHttpWebResponseMessage(response);

            return JsonConvert.DeserializeObject<bool>(json);
        }
    }
}
