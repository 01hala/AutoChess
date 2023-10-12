/*
 * BattleDis.ts
 * author: Hotaru
 * 2023/10/12
 * 战斗展示类
 */
import { _decorator, Component, Node } from 'cc';
import { Queue } from './Queue';
import { Battle } from '../battle';
import { Camp, EventType } from '../enums';
import { RoleDis } from './RoleDis';
const { ccclass, property } = _decorator;

@ccclass('BattleDis')
export class BattleDis extends Component {

    @property(Queue)
    public selfQueue:Queue;
    @property(Queue)
    public enemyQueue:Queue;

    private battle:Battle=new Battle();

    start() {

    }

    update(deltaTime: number) {
        
    }

    onAttackEvent()
    {
        this.battle.on_event.push((evs)=>
        {
            for(let ev of evs)
            {
                if(EventType.AttackInjured==ev.type && Camp.Self == ev.spellcaster.camp)
                {
                    this.selfQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).Attack(ev.spellcaster.camp);
                }
                if(EventType.AttackInjured==ev.type && Camp.Enemy == ev.spellcaster.camp)
                {
                    this.enemyQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).Attack(ev.spellcaster.camp);
                }
            }
        });
    }

    onChangeAtt()
    {
        this.battle.on_event.push((evs)=>
        {
            for(let ev of evs)
            {
                if(EventType.EatFood==ev.type && Camp.Self == ev.spellcaster.camp)
                {
                    this.selfQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).changeAtt;
                }
                if(EventType.EatFood==ev.type && Camp.Enemy == ev.spellcaster.camp)
                {
                    this.enemyQueue.roleList[ev.spellcaster.index].getComponent(RoleDis).changeAtt;
                }
            }
        });
    }
}


