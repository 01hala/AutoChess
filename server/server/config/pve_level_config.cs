using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;
using Abelkhan;
using System.Linq;

namespace config
{
    public class PVELevelConfig
    {
        public int ID;
        public List<int> EventID;
        public List<int> Level;

        public static Dictionary<int, PVELevelConfig> Load(string path)
        {
            var obj = new Dictionary<int, PVELevelConfig>();

            FileStream fs = File.OpenRead(path);
            byte[] data = new byte[fs.Length];
            int offset = 0;
            int remaining = data.Length;
            while (remaining > 0)
            {

                int read = fs.Read(data, offset, remaining);
                if (read <= 0)
                    throw new EndOfStreamException("file read at" + read.ToString() + " failed");

                remaining -= read;
                offset += read;
            }

            var handle = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(System.Text.Encoding.Default.GetString(data));
            foreach (var o in handle.Values)
            {
                var pec = new PVELevelConfig();
                pec.ID = (int)o["ID"];
                var eventIDs = (string)o["EventID"];
                if (!string.IsNullOrEmpty(eventIDs))
                {
                    pec.EventID = eventIDs.Split(';').Select(int.Parse).ToList();
                }
                else
                {
                    pec.EventID = new List<int>();
                }
                var levels = (string)o["Level"];
                if ( (!string.IsNullOrEmpty(levels)))
                {
                    pec.Level = levels.Split(';').Select(int.Parse).ToList();
                }
                else
                {
                    pec.Level = new List<int>();
                }

                obj[pec.ID] = pec;
            }

            return obj;
        }
    }
}