import { _decorator, animation, CCInteger, Component, Enum, Node , Animation, RichText } from 'cc';
import { Role } from '../../battle/role';
import { Camp , EventType, Property} from '../../battle/enums';
import { Battle } from '../../battle/battle';
import * as skill from '../../battle/skill/skill_base'
import { netDriver } from '../../netDriver/netDriver';
import { netGame } from '../../netDriver/netGame';
const { ccclass, property } = _decorator;

@ccclass('RoleDis')
export class RoleDis extends Component 
{
    @property({
        type:CCInteger,
        displayName:"角色ID"
    })
    public RoleId:number;

    public Hp:number;
    public AtkNum:number;

    public Level:number;

    private roleInfo:Role=null;
    private battle:Battle=new Battle();

    private AtkAnim:Animation;

    private hpText:RichText;
    private atkText:RichText;
    //private nGame:netGame=new netGame();

    start() 
    {
        //this.nGame.cb_battle=(self,target)=>
        //{  
        //};
        


        this.AtkAnim=this.node.getChildByName("Sprite").getComponent(Animation);
        this.hpText=this.node.getChildByName("Hp").getComponentInChildren(RichText);
        this.atkText=this.node.getChildByName("Atk").getComponentInChildren(RichText);

        this.changeAtt();

        
    }

    update(deltaTime: number) 
    {
        this.battle.on_event.forEach(element => {
            
        });
    }

    Attack()
    {
        this.AtkAnim.play();
        this.changeAtt();
    }

    changeAtt()
    {
        this.Hp=this.roleInfo.GetProperty(Property.HP);
        this.AtkAnim=this.AtkNum=this.roleInfo.GetProperty(Property.Attack);
        this.hpText.string="<color=#00ff00>"+this.Hp+"</color>";
        this.atkText.string="<color=#00ff00>"+this.AtkNum+"</color>";
    }
}


