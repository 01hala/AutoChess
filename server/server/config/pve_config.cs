using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;
using Abelkhan;
using System.Linq;

namespace config
{
    public class PVEConfig
    {
        public int ID;
        public List<int> EventID;
        public List<int> Level;

        public static Dictionary<int, PVEConfig> Load(string path)
        {
            var obj = new Dictionary<int, PVEConfig>();

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
                var pec = new PVEConfig();
                pec.ID = (int)o["ID"];
                var eventIDs = (string)o["EventID"];
                pec.EventID = eventIDs.Split(',').Select(int.Parse).ToList();
                var levels = (string)o["Level"];
                pec.Level = levels.Split(',').Select(int.Parse).ToList();

                obj[pec.ID] = pec;
            }

            return obj;
        }
    }
}