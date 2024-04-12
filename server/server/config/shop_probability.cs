using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;
using Abelkhan;

namespace config
{
    public class ShopProbabilityConfig
    {
        public int Stage;
        public int level1Probability;
        public int level2Probability;
        public int level3Probability;
        public int level4Probability;
        public int level5Probability;
        public int level6Probability;

        public static int RandomStage(int base_stage, Dictionary<int, ShopProbabilityConfig> cfg)
        {
            var stage = 1;

            if (cfg.TryGetValue(base_stage, out ShopProbabilityConfig backCfg)) {
                var r = RandomHelper.RandomInt(100);

                if (r < backCfg.level1Probability)
                {
                    stage = 1;
                }
                else if (r < (backCfg.level1Probability + backCfg.level2Probability))
                {
                    stage = 2;
                }
                else if (r < (backCfg.level1Probability + backCfg.level2Probability + backCfg.level3Probability))
                {
                    stage = 3;
                }
                else if (r < (backCfg.level1Probability + backCfg.level2Probability + backCfg.level3Probability + backCfg.level4Probability))
                {
                    stage = 4;
                }
                else if (r < (backCfg.level1Probability + backCfg.level2Probability + backCfg.level3Probability + backCfg.level4Probability + backCfg.level5Probability))
                {
                    stage = 5;
                }
                else if (r < (backCfg.level1Probability + backCfg.level2Probability + backCfg.level3Probability + backCfg.level4Probability + backCfg.level5Probability + backCfg.level6Probability))
                {
                    stage = 6;
                }
            }

            return stage;
        }

        public static Dictionary<int, ShopProbabilityConfig> Load(string path)
        {
            var obj = new Dictionary<int, ShopProbabilityConfig>();

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
                var probabilityc = new ShopProbabilityConfig();
                probabilityc.Stage = (int)o["Stage"];
                probabilityc.level1Probability = (int)o["level1Probability"];
                probabilityc.level2Probability = (int)o["level2Probability"];
                probabilityc.level3Probability = (int)o["level3Probability"];
                probabilityc.level4Probability = (int)o["level4Probability"];
                probabilityc.level5Probability = (int)o["level5Probability"];
                probabilityc.level6Probability = (int)o["level6Probability"];

                obj[probabilityc.Stage] = probabilityc;
            }

            return obj;
        }
    }
}