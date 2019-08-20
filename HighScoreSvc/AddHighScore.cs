using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System.Collections.Generic;

namespace UpdateHighScores
{
    public static class AddHighScores
    {
        [FunctionName("AddHighScores")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var newScore = new HighScore(req.Query["name"], int.Parse(req.Query["score"]));            

            var storageAccount = StorageAccountHelper.Connect();

            CloudTableClient client = storageAccount.CreateCloudTableClient();
            var table = client.GetTableReference("HighScore");

            await table.ExecuteAsync(TableOperation.InsertOrReplace(newScore));

            return new OkResult();
        }
    }
}
