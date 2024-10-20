using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;
using Abelkhan;

namespace config
{
    public class PVEEnemyConfig
    {
        public int EnemyID;
        public int RoleID;
        public int RoleLevel;
        public int RoleHP;
        public int RoleAttack;
        public int RoleEquip;

        public static Dictionary<int, PVEEnemyConfig> Load(string path)
        {
            var obj = new Dictionary<int, PVEEnemyConfig>();

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
                var roleInfo = new PVEEnemyConfig();
                roleInfo.EnemyID = (int)o["ID"];
                roleInfo.RoleID = (int)o["RoleID"];
                roleInfo.RoleLevel = (int)o["Level"];
                roleInfo.RoleHP = (int)o["HP"];
                roleInfo.RoleAttack = (int)o["Attack"];
                roleInfo.RoleEquip = (int)o["Equip"];

                obj[roleInfo.EnemyID] = roleInfo;
            }

            return obj;
        }
    }

    public class PVERoundConfig
    {
        public int ID;
        public int Stage;
        public int Gold;
        public List<PVEEnemyConfig> Enemys;

        public static Dictionary<int, PVERoundConfig> Load(string pathPVELevel, string pathPVEEnemy)
        {
            var PVERoleInfoCfg = PVEEnemyConfig.Load(pathPVEEnemy);

            var obj = new Dictionary<int, PVERoundConfig>();

            FileStream fs = File.OpenRead(pathPVELevel);
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
                var pvec = new PVERoundConfig();
                pvec.ID = (int)o["ID"];
                pvec.Stage = (int)o["Stage"];
                pvec.Gold = (int)o["Gold"];
                pvec.Enemys = new List<PVEEnemyConfig>();

                if (PVERoleInfoCfg.TryGetValue((int)o["Locat_1"], out var e))
                {
                    pvec.Enemys.Add(e);
                }
                if (PVERoleInfoCfg.TryGetValue((int)o["Locat_2"], out e))
                {
                    pvec.Enemys.Add(e);
                }
                if (PVERoleInfoCfg.TryGetValue((int)o["Locat_3"], out e))
                {
                    pvec.Enemys.Add(e);
                }
                if (PVERoleInfoCfg.TryGetValue((int)o["Locat_4"], out e))
                {
                    pvec.Enemys.Add(e);
                }
                if (PVERoleInfoCfg.TryGetValue((int)o["Locat_5"], out e))
                {
                    pvec.Enemys.Add(e);
                }
                if (PVERoleInfoCfg.TryGetValue((int)o["Locat_6"], out e))
                {
                    pvec.Enemys.Add(e);
                }

                obj[pvec.ID] = pvec;
            }

            return obj;
        }
    }
}