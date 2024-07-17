using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;
using Abelkhan;

namespace config
{
    public class RoleInfo
    {
        public int RoleID;
        public int RoleAttack;
        public int RoleHP;
        public int RoleLevel;
        public int RoleEquip;
    }

    public class PVELevelConfig
    {
        public int ID;
        public int Stage;
        public int Gold;
        public List<RoleInfo> Roles;

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
                var pvec = new PVELevelConfig();
                pvec.ID = (int)o["ID"];
                pvec.Stage = (int)o["Stage"];
                pvec.Gold = (int)o["Gold"];

                var roleInfo = new RoleInfo();
                roleInfo.RoleID = (int)o["Role1ID"];
                roleInfo.RoleAttack = (int)o["Role1Attack"];
                roleInfo.RoleHP = (int)o["Role1HP"];
                roleInfo.RoleLevel = (int)o["Role1Level"];
                roleInfo.RoleEquip = (int)o["Role1Equip"];
                pvec.Roles.Add(roleInfo);

                roleInfo = new RoleInfo();
                roleInfo.RoleID = (int)o["Role2ID"];
                roleInfo.RoleAttack = (int)o["Role2Attack"];
                roleInfo.RoleHP = (int)o["Role2HP"];
                roleInfo.RoleLevel = (int)o["Role2Level"];
                roleInfo.RoleEquip = (int)o["Role2Equip"];
                pvec.Roles.Add(roleInfo);

                roleInfo = new RoleInfo();
                roleInfo.RoleID = (int)o["Role3ID"];
                roleInfo.RoleAttack = (int)o["Role3Attack"];
                roleInfo.RoleHP = (int)o["Role3HP"];
                roleInfo.RoleLevel = (int)o["Role3Level"];
                roleInfo.RoleEquip = (int)o["Role3Equip"];
                pvec.Roles.Add(roleInfo);

                roleInfo = new RoleInfo();
                roleInfo.RoleID = (int)o["Role4ID"];
                roleInfo.RoleAttack = (int)o["Role4Attack"];
                roleInfo.RoleHP = (int)o["Role4HP"];
                roleInfo.RoleLevel = (int)o["Role4Level"];
                roleInfo.RoleEquip = (int)o["Role4Equip"];
                pvec.Roles.Add(roleInfo);

                roleInfo = new RoleInfo();
                roleInfo.RoleID = (int)o["Role5ID"];
                roleInfo.RoleAttack = (int)o["Role5Attack"];
                roleInfo.RoleHP = (int)o["Role5HP"];
                roleInfo.RoleLevel = (int)o["Role5Level"];
                roleInfo.RoleEquip = (int)o["Role5Equip"];
                pvec.Roles.Add(roleInfo);

                roleInfo = new RoleInfo();
                roleInfo.RoleID = (int)o["Role6ID"];
                roleInfo.RoleAttack = (int)o["Role6Attack"];
                roleInfo.RoleHP = (int)o["Role6HP"];
                roleInfo.RoleLevel = (int)o["Role6Level"];
                roleInfo.RoleEquip = (int)o["Role6Equip"];
                pvec.Roles.Add(roleInfo);

                obj[pvec.ID] = pvec;
            }

            return obj;
        }
    }
}