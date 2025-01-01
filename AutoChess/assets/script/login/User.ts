import * as common from "../battle/AutoChessBattle/common"
import * as enums from '../other/enums'

export class User
{
    public static UserData:common.UserData = null;
    public static OptionsData:OptionsData = null;
}

export class OptionsData
{
    public language:enums.Language = enums.Language.Chinese;
    public mainVolume:number=1;
}

