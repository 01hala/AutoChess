using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;

namespace config
{
    public class EquipConfig
    {
        public int Id;
        public string Name;
        public int Price;
        public int Stage;
        public int Effect;
        public int AttackBonus;
        public int HpBonus;
        public string Value;

        public static Dictionary<int, List<EquipConfig>> LoadStage(Dictionary<int, EquipConfig> cfg)
        {
            var stage = new Dictionary<int, List<EquipConfig>>();

            foreach (var f in cfg.Values)
            {
                if (f.Stage > 0)
                {
                    if (!stage.TryGetValue(f.Stage, out List<EquipConfig> equips))
                    {
                        equips = new List<EquipConfig>();
                        stage[f.Stage] = equips;
                    }
                    equips.Add(f);
                }
            }

            return stage;
        }

        public static Dictionary<int, EquipConfig> Load(string path)
        {
            var obj = new Dictionary<int, EquipConfig>();

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
                var equipc = new EquipConfig();
                equipc.Id = (int)o["Id"];
                equipc.Name = (string)o["Name"];
                equipc.Price = (int)o["Price"];
                equipc.Stage = (int)o["Stage"];
                equipc.Effect = (int)o["Effect"];
                equipc.AttackBonus = (int)o["AttackBonus"];
                equipc.HpBonus = (int)o["HpBonus"];
                equipc.Value = (string)o["Value"];

                obj[equipc.Id] = equipc;
            }

            return obj;
        }
    }
}