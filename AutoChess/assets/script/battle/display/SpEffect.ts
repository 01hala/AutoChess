import { _decorator, Component, Node, sp } from 'cc';
import * as enums from '../../other/enums';
import * as common from '../../battle/AutoChessBattle/common';
import { loadAssets } from '../../bundle/LoadAsset';
import { config } from '../AutoChessBattle/config/config';
const { ccclass, property } = _decorator;

@ccclass('SpEffect')
export class SpEffect
{
    //普通护盾特效
    private shieldEffect:sp.Skeleton;
    //恢复特效
    private heathEffect:sp.Skeleton;
    private 
    //技能特效
    private skillEffect:sp.Skeleton;
}


