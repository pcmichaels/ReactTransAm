using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Text;

namespace UpdateHighScores
{
        public class HighScore : TableEntity
        {
            public HighScore(string name, int score)
            {
                Username = name;
                Score = score;

                PartitionKey = Username;
                RowKey = Score.ToString();
            }

            public HighScore() { }

            public string Username { get; set; }

            public int Score { get; set; }
        }
    }
