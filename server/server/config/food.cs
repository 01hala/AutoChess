using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;

namespace config
{
    public class FoodConfig
    {
        public int Id;
        public string Name;
        public int Price;
        public int Stage;
        public int[] Effect;
        public int EffectScope;
        public int AttackBonus;
        public int HpBonus;
        public int Vaule;
        public int Count;

        public static Dictionary<int, List<FoodConfig> > LoadStage(Dictionary<int, FoodConfig> cfg)
        {
            var stage = new Dictionary<int, List<FoodConfig>>();

            foreach (var f in cfg.Values)
            {
                if (!stage.TryGetValue(f.Stage, out List<FoodConfig> foods))
                {
                    foods = new List<FoodConfig>();
                    stage[f.Stage] = foods;
                }

                foods.Add(f);
            }

            return stage;
        }

        public static Dictionary<int, FoodConfig> Load(string path)
        {
            var obj = new Dictionary<int, FoodConfig>();

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
                var foodc = new FoodConfig();
                foodc.Id = (int)o["Id"];
                foodc.Name = (string)o["Name"];
                foodc.Price = (int)o["Price"];
                foodc.Stage = (int)o["Stage"];
                var effect = (string)o["Effect"];
                var es = effect.Split('|');
                var e = new List<int>();
                foreach (var s in es)
                {
                    e.Add(int.Parse(s));
                }
                foodc.Effect = e.ToArray();
                foodc.EffectScope = (int)o["EffectScope"];
                foodc.AttackBonus = (int)o["AttackBonus"];
                foodc.HpBonus = (int)o["HpBonus"];
                foodc.Vaule = (int)o["Vaule"];
                foodc.Count = (int)o["Count"];

                obj[foodc.Id] = foodc;
            }

            return obj;
        }
    }
}