using Microsoft.WindowsAzure.Storage;
using System;
using System.Collections.Generic;
using System.Text;

namespace UpdateHighScores
{
    public static class StorageAccountHelper
    {
        public static CloudStorageAccount Connect()
        {
            string accountName = Environment.GetEnvironmentVariable("StorageAccountName");
            string accountKey = Environment.GetEnvironmentVariable("StorageAccountKey");

            var storageAccount = new CloudStorageAccount(
                new Microsoft.WindowsAzure.Storage.Auth.StorageCredentials(
                    accountName, accountKey), true);
            return storageAccount;
        }
    }
}
