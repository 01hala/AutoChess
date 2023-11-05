using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;

namespace config
{
    public class RoleConfig
    {
        public int Id;
        public string Name;
        public int Stage;
        public int Level;
        public int Price;
        public int Attack;
        public int Hp;
        public int Fetters;
        public int Hermes;
        public string Res;

        public static Dictionary<int, List<RoleConfig> > LoadStage(Dictionary<int, RoleConfig> cfg)
        {
            var stage = new Dictionary<int, List<RoleConfig>>();

            foreach (var r in cfg.Values)
            {
                if (!stage.TryGetValue(r.Stage, out List<RoleConfig> roles))
                {
                    roles = new List<RoleConfig>();
                    stage[r.Stage] = roles;
                }

                roles.Add(r);
            }

            return stage;
        }

        public static Dictionary<int, RoleConfig> Load(string path)
        {
            var obj = new Dictionary<int, RoleConfig>();

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
                var rolec = new RoleConfig();
                rolec.Id = (int)o["Id"];
                rolec.Name = (string)o["Name"];
                rolec.Stage = (int)o["Stage"];
                rolec.Price = (int)o["Price"];
                rolec.Attack = (int)o["Attack"];
                rolec.Hp = (int)o["Hp"];
                rolec.Fetters = (int)o["Fetters"];
                rolec.Res = (string)o["Res"];

                obj[rolec.Id] = rolec;
            }

            return obj;
        }
    }
}