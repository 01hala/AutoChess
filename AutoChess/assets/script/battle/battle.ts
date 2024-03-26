/*
 * battle.ts
 * author: qianqians
 * 2023/9/24
 */
import * as common from "../serverSDK/common"
import * as skill from './skill/skill_base'
import * as role from './role'
import * as team from './team'
import * as enums from '../other/enums'

export class linkEvent{
    public front:linkEvent;
    public event:skill.Event;
    public next:linkEvent;
}

export class EventList{
    private count:number;
    //头指针的front指向链表尾部
    public head:linkEvent;
    
    constructor(evl:EventList=null) {
        if(!evl){
            this.count = 0
            this.head=new linkEvent();
            this.head.event=this.head.front=this.head.next=null;
        }
        else{
            this.count=evl.Length();
            this.head=evl.head;
        }
    }

    [Symbol.iterator]() {
        let current = this.head.next
        return {
          next() {
            if (current) {
              let res = current
              current = current.next
              return { done: false, value: res.event }
            } else {
              return { done: true, value: null }
            }
          },
        }
      }

    /** 按照事件的优先级将事件推送至链表*/
    public push(ev:skill.Event){
        try{
            let t=new linkEvent();
            t.event=ev;
            //如果链表是空的
            if(!this.head.next){
                t.front=this.head;
                t.next=null;
                this.head.next=this.head.front=t;
                console.log("list is empty,insert the ev at the head");
            }
            else{
                let current=this.head.next;
                while(null != current){
                    if(current.event.priority>ev.priority){
                        t.front=current.front;
                        t.next=current;
                        current.front.next=t;
                        current.front=t;                        
                    }
                    else if(null==current.next){
                        current.next=t;
                        t.front=current;
                        t.next=null;
                        this.head.front=t;
                    }
                    current=current.next;
                }
                console.log("try to push event into the list");
            }
            this.count++;
        }catch{
            console.log("push event of event list failed");
        }
    }

    /** 直接将事件推送至链表末尾*/
    public push_back(ev:skill.Event){
        try{
            if(!this.head.next) this.push(ev);
            else{
                let t=new linkEvent();
                t.event=ev;
                t.next=null;
                this.head.front.next=t;
                t.front=this.head.front;
                this.head.front=t;
                this.count++;
            }
        }
        catch{
            console.log("push_back event of event list failed");
        }
    }

    /** 事件插入到指定位置*/
    public insert(ev:skill.Event){
        //========to do========//
        //想不到这个函数的用处所以暂时不写
    }

    /** 移除指定事件,返回是否移除成功*/
    public remove(ev:skill.Event):boolean{
        try{
            if(!this.head.next) return false;
            let current=this.head.next;
            while(current){
                if(current.event==ev){
                    current.front.next=current.next;
                    current.next.front=current.front;
                    this.count--;
                    return true;
                }
                current=current.next;
            }
            return false;
        }
        catch{
            console.log("remove event of event list failed");
        }
    }

    /** 清空链表*/
    public Clear(){
        this.head.next=this.head.front=null;
        this.count=0;
    }

    /** 获取事件列表长度*/
    public Length():number{
        return this.count;
    }
}

export class Battle {
    private selfTeam : team.Team;
    private enemyTeam : team.Team;

    private evs:skill.Event[] = [];

    public victory = 0;
    public faild = 0;

    public constructor(self:common.UserBattleData, target:common.UserBattleData) {
        this.selfTeam = new team.Team(enums.Camp.Self, self, self.RoleList);
        this.enemyTeam = new team.Team(enums.Camp.Enemy, target, target.RoleList);

        this.victory = self.victory;
        this.faild = self.faild;
    }

    public GetSelfTeam() : team.Team {
        return this.selfTeam;
    }

    public GetEnemyTeam() : team.Team {
        return this.enemyTeam;
    }

    public AddBattleEvent(ev:skill.Event) {
        this.evs.push(ev);
    }

    public on_event : ((evs:skill.Event[]) => Promise<void>) = null;

    public StartBattle() {
        let ev = new skill.Event();
        ev.type = enums.EventType.BattleBegin;
        console.log("推送战斗开始事件");
        this.AddBattleEvent(ev);
    }

    private battle() {
        console.log("battle begin!");

        let selfTeam = this.selfTeam.GetRoles();
        for(let role of selfTeam) {
            role.UnlockSkill();
        }

        let enemyTeam = this.enemyTeam.GetRoles();
        for(let role of enemyTeam) {
            role.UnlockSkill();
        }

        let self = this.selfTeam.GetLasterRole();
        let enemy = this.enemyTeam.GetLasterRole();

        if (self != null && enemy != null) {
            self.Attack(enemy, this);
            enemy.Attack(self, this);

            let ev = new skill.Event();
            ev.type = enums.EventType.AfterAttack;
            this.AddBattleEvent(ev);
        }

        console.log("battle end!");
    }

    public GetWinCamp() : enums.Camp {
        if (!this.CheckEndBattle()){
            return enums.Camp.None;
        }

        if (this.selfTeam.CheckDefeated() && this.enemyTeam.CheckDefeated()) {
            return enums.Camp.Tie;
        }

        if (this.selfTeam.CheckDefeated()) {
            return enums.Camp.Enemy;
        }

        return enums.Camp.Self;
    }

    public CheckEndBattle() : boolean {
        return this.evs.length <= 0 && (this.selfTeam.CheckDefeated() || this.enemyTeam.CheckDefeated());
    }

    private  SortEvs(evs:skill.Event[]){
        // if(left>right) return;
        
        // let x=evs[left].priority,i=left,j=right;
        // while(i<j){
        //     while(evs[i].priority<x) i++;
        //     while(evs[j].priority>x) j--; 
        //     if(i<j){
        //         let t=evs[i];
        //         evs[i]=evs[j];
        //         evs[j]=t;
        //     }
        // }
        // this.SortEvs(evs,left,i-1);
        // this.SortEvs(evs,j+1,right);
        for(let i=1;i<evs.length;i++){
            let j=i;
            while(j>0&&evs[j-1].priority>evs[j].priority){
                let t=evs[j-1];
                evs[j-1]=evs[j];
                evs[j]=t;
            }
        }
    }

    public CheckRemoveDeadRole() {
        return this.selfTeam.CheckRemoveDeadRole(this) || this.enemyTeam.CheckRemoveDeadRole(this);
    }

    private triggerBeforeAttack : boolean = true;
    public async TickBattle() : Promise<boolean> {
        let evs = this.evs.slice();
        this.SortEvs(evs);
        await this.on_event.call(null, evs);

        console.log(evs);
        if (this.evs.length > 0) {
            this.evs = [];

            console.log("TickBattle evs:", evs);

            let selfTeam = this.selfTeam.GetRoles();
            for(let index in selfTeam) {
                let role = selfTeam[index];
                if (role.CheckSkillIsLock()) {
                    continue;
                }

                let roleInfo = new skill.RoleInfo();
                roleInfo.properties=role.GetProperties();
                console.log("战斗事件中角色攻击力:")
                // roleInfo.attack=role.GetProperty(enums.Property.Attack);
                // roleInfo.hp=role.GetProperty(enums.Property.HP);
                roleInfo.index =  role.index;
                roleInfo.camp = enums.Camp.Self;
                let p = 0;
                let skillImpl: skill.SkillBase = null;
                for(let skill of role.skill) {
                    if (skill.trigger.CheckSkillTrigger(evs, roleInfo)) {
                        if (skill.skill.Priority > p) {
                            skillImpl = skill.skill;
                            p = skill.skill.Priority;
                        }
                    }
                }
                if (skillImpl) {
                    role.LockSkill();
                    skillImpl.UseSkill(roleInfo, this);
                }
            }

            let enemyTeam = this.enemyTeam.GetRoles();
            for(let index in enemyTeam) {
                let role = enemyTeam[index];
                if (role.CheckSkillIsLock()) {
                    continue;
                }

                let roleInfo = new skill.RoleInfo();
                roleInfo.properties=role.GetProperties();
                // roleInfo.attack=role.GetProperty(enums.Property.Attack);
                // roleInfo.hp=role.GetProperty(enums.Property.HP);
                roleInfo.index =  role.index;
                roleInfo.camp = enums.Camp.Enemy;
                let p = 0;
                let skillImpl: skill.SkillBase = null;
                for(let skill of role.skill) {
                    if (skill.trigger.CheckSkillTrigger(evs, roleInfo)) {
                        if (skill.skill.Priority > p) {
                            skillImpl = skill.skill;
                            p = skill.skill.Priority;
                        }
                    }
                }
                if (skillImpl) {
                    role.LockSkill();
                    skillImpl.UseSkill(roleInfo, this);
                }
            }

            //console.log("tick events");
            return false;
        }

        if (this.evs.length <= 0) {
            if (this.CheckRemoveDeadRole()) {
                return false;
            }
        }

        if (this.triggerBeforeAttack) {
            let ev = new skill.Event();
            ev.type = enums.EventType.BeforeAttack;
            this.AddBattleEvent(ev);
            this.triggerBeforeAttack = false;

            //console.log("trigger Before Attack");
            return false;
        }

        this.battle();
        //console.log("battle Attack");
        this.triggerBeforeAttack = true;

        if (this.evs.length > 0) {
            return false;
        }

        return this.CheckEndBattle();
    }
}

export function GetSelfTeam() {
    throw new Error('Function not implemented.')
}
