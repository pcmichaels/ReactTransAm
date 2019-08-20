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
    public static class GetHighScores
    {
        [FunctionName("GetHighScores")]
        public static async Task<IList<HighScore>> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string top = req.Query["top"];

            var storageAccount = StorageAccountHelper.Connect();

            CloudTableClient client = storageAccount.CreateCloudTableClient();
            var table = client.GetTableReference("HighScore");
            var tq = new TableQuery<HighScore>();
            var continuationToken = new TableContinuationToken();
            var result = await table.ExecuteQuerySegmentedAsync(tq, continuationToken);
            
            return result.Results;
        }
    }
}
