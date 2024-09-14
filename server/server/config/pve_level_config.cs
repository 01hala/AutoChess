using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;
using Abelkhan;

namespace config
{
    public class PVERoleInfoConfig
    {
        public int RoleID;
        public int RoleLevel;
        public int RoleHP;
        public int RoleAttack;
        public int RoleEquip;
        public List<int> RoleBuff;

        public static Dictionary<int, PVERoleInfoConfig> Load(string path)
        {
            var obj = new Dictionary<int, PVERoleInfoConfig>();

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
                var roleInfo = new PVERoleInfoConfig();
                roleInfo.RoleID = (int)o["ID"];
                roleInfo.RoleLevel = (int)o["Level"];
                roleInfo.RoleHP = (int)o["HP"];
                roleInfo.RoleAttack = (int)o["Attack"];
                roleInfo.RoleEquip = (int)o["Equip"];
                var buff = (string)o["Buff"];
                roleInfo.RoleBuff = Newtonsoft.Json.JsonConvert.DeserializeObject<List<int>>(buff);

                obj[roleInfo.RoleID] = roleInfo;
            }

            return obj;
        }
    }

    public class PVELevelConfig
    {
        public int ID;
        public int Stage;
        public int Gold;
        public List<PVERoleInfoConfig> Roles;

        public static Dictionary<int, PVELevelConfig> Load(string pathPVELevel, string pathPVERoleInfo)
        {
            var PVERoleInfoCfg = PVERoleInfoConfig.Load(pathPVERoleInfo);

            var obj = new Dictionary<int, PVELevelConfig>();

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
                var pvec = new PVELevelConfig();
                pvec.ID = (int)o["ID"];
                pvec.Stage = (int)o["Stage"];
                pvec.Gold = (int)o["Gold"];

                pvec.Roles.Add(PVERoleInfoCfg[(int)o["Role1ID"]]);
                pvec.Roles.Add(PVERoleInfoCfg[(int)o["Role2ID"]]);
                pvec.Roles.Add(PVERoleInfoCfg[(int)o["Role3ID"]]);
                pvec.Roles.Add(PVERoleInfoCfg[(int)o["Role4ID"]]);
                pvec.Roles.Add(PVERoleInfoCfg[(int)o["Role5ID"]]);
                pvec.Roles.Add(PVERoleInfoCfg[(int)o["Role6ID"]]);

                obj[pvec.ID] = pvec;
            }

            return obj;
        }
    }
}